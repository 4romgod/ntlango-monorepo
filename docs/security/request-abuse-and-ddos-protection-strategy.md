# Gatherle Request-Abuse And DDoS Protection Strategy

Created: 2026-03-01

## Purpose

This document defines the recommended defense strategy for protecting Gatherle against:

- Anonymous abuse on public GraphQL routes
- Authenticated abuse on GraphQL and WebSocket APIs
- High-cost query abuse that can exhaust Lambda, MongoDB, or downstream services
- Layer 7 denial-of-service patterns that increase latency and cost
- Application misuse by legitimate but malicious users

It is the implementation guide that supports the open risks currently tracked in
`docs/security/threat-model-risk-register.md`, especially:

- `R-06` Missing request-abuse controls
- `R-11` No explicit L7 DDoS controls on public API surfaces

## Current Architecture Assumptions

This strategy is written for the current state of this repository:

- GraphQL API is public and is served from API Gateway + Lambda via `apps/api`.
- Some GraphQL operations are intentionally public and do not require authentication.
- WebSocket access requires a valid JWT at connect time and is served from API Gateway WebSocket + Lambda.
- Authenticated users can access broader GraphQL operations and all allowed WebSocket routes.
- AWS infrastructure is defined in `infrastructure/cdk`.
- Future edge and provider-managed controls can be defined in `infrastructure/terraform`.
- Cloudflare is the preferred edge layer for DDoS mitigation, rate controls, bot filtering, and shielding the AWS origin.

## The Core Problem

Gatherle has two fundamentally different abuse surfaces:

1. Anonymous traffic
   - Public users can call some GraphQL operations without a trusted identity.
   - This means the system cannot rely on `userId`-based throttling as the first line of defense.
   - Edge controls and request-cost controls are mandatory.

2. Authenticated traffic
   - A valid user can still abuse the API by sending too many requests, opening too many WebSocket sessions, or
     repeatedly invoking expensive operations.
   - Once a user is authenticated, the correct identity for enforcement is the user, not just the IP address.

No single control solves both classes of abuse. The design must be layered.

## Security Objectives

The system should:

- Reduce anonymous flood traffic before it reaches API Gateway and Lambda.
- Prevent a single request from being computationally abusive, even if request volume is low.
- Throttle authenticated abuse per user, not only per IP.
- Prevent one user from bypassing limits by opening many WebSocket connections.
- Avoid over-reliance on long-lived IP bans because IPs are recycled, shared behind NAT, and easily rotated.
- Keep legitimate public traffic working while degrading or challenging suspicious traffic.
- Make abuse visible through logs, metrics, and alerts.
- Preserve flexibility so limits can be tuned without major code rewrites.

## Design Principles

### 1. Use Different Identities For Different Trust Levels

- Anonymous traffic is not identified by a stable user identity, so the best available signal is a short-lived client
  fingerprint.
- Authenticated traffic should be keyed primarily by `userId` (or JWT `sub`).
- WebSocket controls should use both `userId` and connection metadata, because one user can open multiple concurrent
  sockets.

### 2. Never Rely On IP As A Permanent Identity

IP addresses are useful as a short-lived signal, not as a durable user identity.

- IPs can be shared by many legitimate users (NAT, offices, mobile carriers).
- IPs can be rotated by abusive users (VPNs, proxies, botnets).
- IPs can be reassigned later to unrelated clients.

Because of this:

- IP-based controls should use short windows and short TTLs.
- IP-based controls should prefer temporary rate limiting, challenges, or cooldowns over permanent blocking.
- IP is one input into risk scoring, not the whole identity model.

### 3. Block Early, Validate Deeply

The control stack should act in this order:

1. Edge layer blocks or challenges obvious bad traffic.
2. API gateway and origin provide coarse safety rails.
3. Application layer enforces semantic correctness, operation cost, and user-aware quotas.
4. Data layer limits blast radius through pagination caps, efficient queries, and safe defaults.

### 4. Rate Limits Alone Are Not Enough

A single expensive GraphQL request can be abusive even if request volume is low.

This means the application must enforce:

- query depth limits
- complexity/cost limits
- pagination limits
- operation-specific controls for expensive paths

### 5. Controls Must Be Observable

Every blocking, throttling, challenge, or disconnect decision must be measurable. Without this, limits cannot be safely
adjusted.

## Threat Model By Surface

### Public GraphQL

Main risks:

- Anonymous scraping of public data
- Query-shape abuse through deeply nested or high-fanout GraphQL requests
- High request volume against public endpoints
- Cache bypass patterns that force origin work
- Cost amplification through expensive list/search operations

### Authenticated GraphQL

Main risks:

- One user repeatedly invoking high-cost operations
- Enumeration or bulk export through authenticated reads
- Automated mutation abuse
- Token-valid clients replaying requests at a rate that degrades service

### WebSocket Connect

Main risks:

- Token brute force or invalid handshake floods
- Reconnect storms
- One user opening many simultaneous connections
- Origin load from repeated `$connect` attempts

### Authenticated WebSocket Messages

Main risks:

- Message spam (`chat.send`, subscriptions, pings)
- Large payload abuse
- Route misuse through high-frequency events
- One user using multiple sockets to bypass per-connection limits

## Recommended Layered Defense Model

## Layer 1: Edge Protection (Cloudflare)

Cloudflare should be the first line of defense for both the GraphQL custom domain and the WebSocket custom domain.

### Required Edge Positioning

To make Cloudflare meaningful:

- Public API domains must resolve through Cloudflare.
- The API must be reachable through custom domains that Cloudflare proxies.
- Direct AWS `execute-api` endpoints should be disabled so attackers cannot bypass Cloudflare and hit API Gateway
  directly.

This is mandatory. If the default API Gateway endpoint remains enabled, any attacker can skip the edge protections.

### What Cloudflare Should Do

Cloudflare should be used for:

- Layer 7 DDoS mitigation
- Bot and anomaly filtering
- Rate limiting of anonymous traffic
- Optional JWT-aware edge rules for authenticated traffic
- Shielding AWS origin details from direct public exposure
- CDN caching for safe, cacheable public responses

### Anonymous Traffic Controls At The Edge

For unauthenticated public GraphQL traffic, Cloudflare should:

- Rate limit by short-lived client signals:
  - IP address
  - user-agent
  - path/route
  - country/ASN if needed
- Use short windows (for example 10-60 seconds), not long bans.
- Prefer challenge or temporary mitigation over indefinite hard blocks.
- Escalate actions as traffic becomes more suspicious:
  - log only
  - challenge
  - temporary block

The goal is to slow down or filter obvious floods before requests consume API Gateway and Lambda capacity.

### Authenticated Traffic Controls At The Edge

For authenticated API calls, Cloudflare can add a first-pass per-user throttle if API Shield and JWT validation are
enabled.

The recommended identity for this is the JWT subject (`sub`) or an equivalent stable user claim.

This is useful for:

- quickly reducing abusive authenticated bursts
- applying coarse edge limits before the request reaches origin
- identifying obviously abusive users earlier

However, Cloudflare edge limits are still a coarse control. They should not be treated as the single source of truth for
per-user quotas.

### Edge Limits For WebSocket

At the WebSocket front door, Cloudflare should enforce:

- per-IP connection attempt limits
- cooldowns for repeated failed or bursty handshakes
- challenge or block patterns for obvious reconnect storms

Even though WebSocket requires JWT auth, connect-time floods can still consume capacity.

### CDN And Cache Strategy For Public Reads

For cacheable public reads, Cloudflare should reduce origin pressure by:

- caching safe public responses where the response is the same for all users
- honoring response caching only for operations explicitly designed to be cache-safe
- avoiding cache on authenticated or personalized responses

This is not a substitute for authorization, but it can materially reduce origin cost on high-volume public traffic.

## Layer 2: Origin Entry Controls (API Gateway / AWS)

AWS origin controls should exist as a coarse circuit breaker, not as the primary identity-aware control.

### GraphQL API Gateway

API Gateway stage throttling can still be useful as:

- a last-resort cap during spikes
- protection against runaway origin traffic if edge rules are misconfigured
- a coarse operational guardrail

But it is not sufficient for per-user enforcement because stage throttles do not understand application users.

### WebSocket API Gateway

At the WebSocket layer, origin controls should focus on:

- sane integration timeouts
- safe payload size limits where available
- backpressure against connect storms

Again, this is a coarse layer. Fine-grained behavior belongs in application code.

## Layer 3: Application-Level GraphQL Abuse Controls

This is the most important layer for protecting the GraphQL API itself.

## A. Separate Anonymous And Authenticated Policy

The GraphQL server should treat requests in two classes:

- anonymous requests
- authenticated requests

The same endpoint can support both classes, but the rules should not be identical.

### Anonymous GraphQL Requests

Anonymous requests should be treated as the highest-risk class because they have no trusted user identity.

Recommended policy:

- keep the anonymous surface area small
- expose only intentionally public operations
- restrict returned fields where possible
- reject expensive or broad query shapes
- apply tighter limits than authenticated traffic

Best long-term design:

- allow anonymous access only to allowlisted persisted queries for public operations
- avoid allowing arbitrary raw GraphQL documents from anonymous clients

This is the strongest structural control available for public GraphQL.

### Authenticated GraphQL Requests

Authenticated requests can access broader operations, but should be governed by:

- per-user request-rate limits
- per-user cost budgets
- route or operation-class quotas
- stricter write throttles for sensitive mutations

The identity here should be the verified `userId` from the JWT, not the IP address.

## B. Enforce Query Cost, Not Just Request Count

The GraphQL server should reject or throttle requests based on computational cost.

Recommended controls in `apps/api/lib/graphql/apollo/server.ts`:

- maximum depth
- maximum complexity score
- optional field-specific cost multipliers for expensive resolvers
- failure before resolver execution when the request exceeds policy

Why this matters:

- a single abusive query can trigger many resolver executions
- nested relationships can multiply database work
- request-count throttles alone do not prevent expensive one-shot requests

### Initial Design Guidance For Cost Rules

Use conservative defaults first. Example starting points:

- anonymous max depth: 3-4
- authenticated max depth: 5-6
- stricter cost budget for anonymous requests
- tighter budgets on search/list and relationship-heavy operations

The exact numbers should be tuned after observing real traffic.

## C. Keep Pagination Strict

Pagination is a core abuse control because large page sizes amplify query cost.

The existing pagination caps are already a good baseline. This strategy assumes:

- all generic list reads keep hard maximum page sizes
- aggregate/list helpers reject invalid or excessive limits
- new public queries do not bypass the common pagination constraints

Pagination limits should be viewed as a first-class security control, not just a performance feature.

## D. Bucket Requests By Operation Class

Do not use one global quota for all GraphQL requests.

Recommended buckets:

- `graphql:public:read`
- `graphql:auth:read`
- `graphql:auth:write`
- `graphql:auth:expensive`

Examples of expensive operations:

- wide list searches
- nested participant/follower style traversals
- operations that trigger large aggregation pipelines

This prevents cheap reads and expensive writes from competing for the same quota.

## E. Use A Shared Rate-Limit Store

Because the API runs on Lambda, in-memory counters are not reliable enough for real enforcement.

The application-level limiter should use a shared store that survives concurrency and multiple Lambda instances.

Options:

- MongoDB-backed TTL counters
- Redis-backed counters (preferred if a dedicated cache/rate-limit store is introduced later)

Short-term, MongoDB-backed TTL counters may be the lowest-friction fit for this repository because MongoDB is already a
core dependency. Long-term, Redis is typically the better fit for high-volume rate limiting.

### Identity Keys For GraphQL

Recommended keys:

- anonymous: `anon:<fingerprint>:graphql:<bucket>`
- authenticated: `user:<userId>:graphql:<bucket>`

The anonymous fingerprint should be short-lived and can include:

- IP
- user-agent family
- route class
- anonymous cookie/session token if one exists

## Layer 4: Application-Level WebSocket Abuse Controls

Requiring JWT at connect time is good, but it is not enough.

WebSocket needs separate controls for connection setup and for ongoing message traffic.

## A. Connect-Time Controls

The connect path should enforce:

- token validation
- per-IP connect-attempt limits
- per-user concurrent connection caps
- cooldowns for repeated reconnect loops

Recommended keys:

- pre-auth or invalid-token attempts: `anon:<ip>:ws:connect`
- valid-user connects: `user:<userId>:ws:connect`

This protects against:

- reconnect storms
- scripted handshake abuse
- one user opening many sockets to spread load

## B. Per-User Concurrent Connection Limits

The system should cap the number of active sockets a single user can hold at the same time.

This is important because:

- a user can open multiple browser tabs
- a malicious user can intentionally open many clients
- per-connection limits alone are easy to bypass

The WebSocket connection registry already stores `userId`, so this should be enforced by counting current live
connections for the user and rejecting or evicting excess sessions according to policy.

## C. Message-Rate Controls

After a connection is established, message throttling should be based on `userId` and route name.

Recommended buckets:

- `ws:user:<userId>:ping`
- `ws:user:<userId>:notification.subscribe`
- `ws:user:<userId>:chat.send`
- `ws:user:<userId>:chat.read`

`chat.send` should be much stricter than `ping`.

### Why Per-Route Buckets Matter

Different WebSocket actions have very different cost profiles:

- `ping` is cheap
- `notification.subscribe` can cause subscription churn
- `chat.send` can fan out to persistence and delivery work

One shared quota would either be too permissive for expensive routes or too restrictive for harmless ones.

## D. Payload And Shape Validation

WebSocket message handlers should also enforce:

- maximum payload size
- strict JSON schema validation per action
- fast rejection of malformed or oversized payloads

Rate limiting helps with volume, but validation helps with per-message cost and reduces parser abuse.

## E. Abuse Response For WebSocket

For WebSocket message abuse, the system should escalate responses:

1. warn/log
2. reject the message
3. apply a short cooldown
4. disconnect the client for repeated abuse

Disconnecting abusive users is often the cleanest control for repeated message spam.

## Identity Model And Rate-Limit Keys

The system should use different identities at different stages:

### Anonymous GraphQL

Primary identity:

- short-lived client fingerprint

Suggested components:

- IP
- user-agent family
- route class
- optional anonymous cookie/session identifier

Use:

- short TTL windows
- soft penalties (challenge/throttle) before long blocks

### Authenticated GraphQL

Primary identity:

- verified `userId`

Secondary signals:

- IP
- device/session metadata

Use:

- per-user request and cost budgets
- stricter limits for sensitive or expensive operations

### WebSocket Connect

Primary identity before successful auth:

- IP or short-lived fingerprint

Primary identity after successful auth:

- verified `userId`

Use:

- connect-attempt limits
- concurrent connection caps

### Authenticated WebSocket Messages

Primary identity:

- verified `userId`

Secondary dimensions:

- route name
- connection count

Use:

- per-user, per-route quotas

## Response Strategy: What Happens When Limits Are Hit

The system should not use one blanket response for all abuse.

### For Anonymous Traffic

Preferred escalation:

1. challenge at the edge
2. temporary rate limit
3. short-duration block for obvious repeated abuse

Do not rely on long IP bans as the default response.

### For Authenticated GraphQL

Preferred escalation:

1. reject the request with a throttling response
2. log the user, bucket, and reason
3. increase monitoring if the same user repeatedly exceeds limits
4. optionally apply temporary account-level cooldown for repeated abusive patterns

### For Authenticated WebSocket

Preferred escalation:

1. reject the abusive message
2. rate-limit the route for a short interval
3. disconnect the socket if abuse continues
4. optionally prevent reconnect for a cooldown period if reconnect storms are detected

## Observability And Alerting Requirements

Abuse controls are only useful if the team can see how they behave.

## Required Metrics

Track at least:

- Cloudflare challenge count
- Cloudflare blocked request count
- API Gateway request volume and 4xx/5xx spikes
- GraphQL validation rejections due to depth/complexity
- GraphQL rate-limit hits by bucket
- WebSocket connect rejects
- WebSocket per-route rate-limit hits
- Forced WebSocket disconnects for abuse
- top abusive anonymous fingerprints
- top abusive authenticated users

## Required Logs

Log structured events for:

- limiter key class (anonymous vs user)
- bucket name
- route/operation name
- action taken (challenge, throttle, reject, disconnect)
- request cost classification if applicable

Do not log sensitive tokens or raw secret-bearing payloads.

## Required Alerts

Alert on:

- sudden spikes in anonymous public GraphQL traffic
- elevated GraphQL complexity rejections
- sustained 429/throttle rates
- repeated connect failures or reconnect storms
- sudden increase in blocked or challenged requests at the edge
- top-user abuse spikes that indicate account or automation misuse

## Infrastructure Ownership Model

To keep implementation clean, ownership should be split by platform:

- `infrastructure/cdk`
  - AWS resources
  - API Gateway
  - Lambda
  - Route53/custom-domain wiring (until or unless DNS authority changes)
  - origin-level safety rails

- `infrastructure/terraform`
  - Cloudflare-managed resources
  - edge DNS proxy records
  - WAF and rate-limit rules
  - bot management and API Shield configuration

This split avoids CDK and Terraform competing for the same provider resources.

## Recommended Implementation Roadmap

## Phase 1: Protect The Origin Boundary

1. Put GraphQL and WebSocket custom domains behind Cloudflare.
2. Ensure API Gateway traffic is forced through the custom domains.
3. Disable direct `execute-api` endpoints so Cloudflare cannot be bypassed.
4. Add first-pass Cloudflare rate limits for anonymous traffic.

Outcome:

- Anonymous floods are reduced before reaching AWS.

## Phase 2: Make Public GraphQL Safe By Design

1. Add GraphQL depth limits.
2. Add GraphQL complexity scoring and rejection.
3. Confirm all public list/search flows stay within pagination caps.
4. Reduce anonymous exposure to intentionally public operations only.
5. Prefer persisted or allowlisted public GraphQL queries.

Outcome:

- One expensive request can no longer impose unbounded computation.

## Phase 3: Add User-Aware Abuse Controls

1. Introduce shared rate-limit storage for Lambda-safe counters.
2. Add per-user GraphQL quotas by operation bucket.
3. Add WebSocket connect throttles and concurrent connection limits.
4. Add per-user, per-route WebSocket message limits.

Outcome:

- Authenticated users can no longer abuse the API or WebSocket unchecked.

## Phase 4: Add Mature Detection And Tuning

1. Add structured metrics and alerts.
2. Tune thresholds based on real traffic.
3. Add operational runbooks for abuse spikes.
4. Add admin support procedures for false positives and temporary overrides.

Outcome:

- Controls become maintainable, measurable, and safe to evolve.

## Initial Threshold Guidance (Starting Points Only)

These are starting points for staged rollout, not permanent settings.

### Anonymous Public GraphQL

- tighter request-rate thresholds than authenticated users
- strict depth and complexity caps
- stronger edge challenge behavior during spikes

### Authenticated GraphQL

- separate buckets for read, write, and expensive operations
- moderate request-rate caps
- lower thresholds on expensive operations than on simple reads

### WebSocket Connect

- low connect-attempt rate per IP
- low maximum concurrent connections per user

### WebSocket Messages

- generous `ping` allowance
- moderate `chat.read`
- strict `chat.send`
- strict subscription churn limits

Exact values should be based on observed product behavior in Beta before being tightened in production.

## Operational Tradeoffs

Every protection introduces tradeoffs:

- stricter anonymous limits can frustrate legitimate high-volume public usage
- stricter per-user limits can affect power users or automation
- Cloudflare challenges can add friction for some legitimate clients
- persisted-query-only public GraphQL reduces flexibility but dramatically improves control

This strategy intentionally favors:

- predictable cost
- lower blast radius
- graceful degradation over unrestricted flexibility

## Explicit Recommendations

The recommended target state for Gatherle is:

1. Cloudflare becomes the enforced public edge for GraphQL and WebSocket custom domains.
2. Direct API Gateway default endpoints are disabled.
3. Public GraphQL remains available, but only through a tightly controlled and intentionally limited surface.
4. GraphQL depth, complexity, and pagination limits are enforced in application code.
5. Authenticated GraphQL is throttled per user, not just per IP.
6. WebSocket is throttled at connect time and per authenticated user for message traffic.
7. All controls emit observable metrics and structured logs.

## File-Level Mapping For Future Implementation

Likely implementation areas in this repository:

- `infrastructure/cdk/lib/stack/graphql-stack.ts`
  - origin endpoint policy, custom domain enforcement, coarse circuit-breakers

- `infrastructure/cdk/lib/stack/websocket-stack.ts`
  - WebSocket custom domain enforcement and origin-level safety rails

- `infrastructure/terraform/`
  - Cloudflare DNS, WAF, rate limiting, JWT-aware edge policy, and origin shielding

- `apps/api/lib/graphql/apollo/server.ts`
  - GraphQL depth/complexity enforcement and early rejection

- `apps/api/lib/graphql/apollo/lambdaHandler.ts`
  - authenticated-vs-anonymous request classification and limiter integration

- `apps/api/lib/websocket/lambdaHandler.ts`
  - connect and per-route throttling hooks

- `apps/api/lib/websocket/routes/*`
  - route-specific quotas and abusive message handling

- shared DAO or service layer (new)
  - shared rate-limit storage and counter updates

## What This Strategy Does Not Assume

This strategy does not assume:

- that IP addresses are stable identities
- that JWT auth alone prevents abuse
- that Cloudflare alone is enough
- that API Gateway stage throttles are a substitute for per-user controls
- that request-count limits alone prevent GraphQL abuse

## Final Guidance

The correct protection model for Gatherle is:

- edge controls for anonymous flood resistance
- application cost controls for GraphQL query safety
- per-user throttling after authentication
- WebSocket-specific quotas for connect and message traffic
- strong observability so controls can be tuned safely

That combination covers the real risk surface. Any design that relies on only one of these layers will leave a material
gap open.
