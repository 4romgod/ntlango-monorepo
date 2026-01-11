# Icon Color Guide

This guide provides semantic color usage for icons across the Ntlango application to ensure consistency and clear visual communication.

## Color Palette

### Primary (Violet `#7c3aed`)
**Use for:**
- Navigation icons (home, events, organizations, venues)
- Social features (follow, friends, connections)
- User profile actions
- Core platform features
- Default interactive icons

**Examples:**
```tsx
<People color="primary" />
<PersonAdd color="primary" />
<DynamicFeed color="primary" />
<AccountCircle color="primary" />
<Explore color="primary" />
```

### Secondary (Coral `#f97316`)
**Use for:**
- Call-to-action icons
- RSVP indicators (Going, Interested)
- Host/Create event buttons
- Featured/trending indicators
- Active state indicators
- Energy/excitement cues

**Examples:**
```tsx
<ControlPointOutlined color="secondary" />  // Create event
<CheckCircle color="secondary" />           // Going/RSVP'd
<Star color="secondary" />                  // Featured
<TrendingUp color="secondary" />            // Trending
<Notifications color="secondary" />         // Active notifications
```

### Muted (Slate `#64748b` / `#94a3b8`)
**Use for:**
- Informational metadata icons
- Location pins
- Time/calendar indicators
- Capacity/attendee counts
- Descriptive details
- Non-interactive decorative icons

**Examples:**
```tsx
<LocationOn sx={{ color: 'icon.muted' }} />
<CalendarToday sx={{ color: 'icon.muted' }} />
<People sx={{ color: 'icon.muted' }} />       // Capacity
<AccessTime sx={{ color: 'icon.muted' }} />
<Info sx={{ color: 'icon.muted' }} />
```

### Success (Emerald `#059669`)
**Use for:**
- Confirmations
- Successful RSVP
- Verified badges
- Completed actions
- Positive status indicators
- Check-in confirmations

**Examples:**
```tsx
<CheckCircle sx={{ color: 'icon.success' }} />
<Verified sx={{ color: 'icon.success' }} />
<TaskAlt sx={{ color: 'icon.success' }} />
```

### Warning (Amber `#f59e0b`)
**Use for:**
- Capacity warnings (nearly full)
- Time-sensitive alerts
- Important notices
- Waitlist indicators
- Caution states

**Examples:**
```tsx
<Warning sx={{ color: 'icon.warning' }} />
<Schedule sx={{ color: 'icon.warning' }} />   // Time running out
<HourglassEmpty sx={{ color: 'icon.warning' }} />
```

### Error (Red `#dc2626`)
**Use for:**
- Error states
- Event cancellations
- Destructive actions (delete, remove)
- Failed actions
- Critical alerts

**Examples:**
```tsx
<Error sx={{ color: 'icon.error' }} />
<Cancel sx={{ color: 'icon.error' }} />
<Delete sx={{ color: 'icon.error' }} />
<EventBusy sx={{ color: 'icon.error' }} />
```

### Info (Sky Blue `#0284c7`)
**Use for:**
- Helpful tooltips
- Information badges
- Educational prompts
- Onboarding hints
- Support messages

**Examples:**
```tsx
<InfoOutlined sx={{ color: 'icon.info' }} />
<Help sx={{ color: 'icon.info' }} />
<Lightbulb sx={{ color: 'icon.info' }} />
```

## Usage Patterns

### Event Cards
```tsx
// Location - muted (informational)
<LocationOn sx={{ color: 'icon.muted' }} />

// Time - muted (informational)
<CalendarToday sx={{ color: 'icon.muted' }} />

// RSVP count - muted (descriptive)
<People sx={{ color: 'icon.muted' }} />

// Going/Interested - secondary (action)
<CheckCircle color="secondary" />
```

### Navigation
```tsx
// Active nav items - primary
<Home color="primary" />
<Event color="primary" />

// Messages with unread - secondary
<Mail color="secondary" />

// Notifications with alerts - secondary
<Notifications color="secondary" />
```

### Status Indicators
```tsx
// Event confirmed - success
<CheckCircle sx={{ color: 'icon.success' }} />

// Event cancelled - error
<Cancel sx={{ color: 'icon.error' }} />

// Almost full - warning
<Warning sx={{ color: 'icon.warning' }} />

// Available spots - muted
<CheckBox sx={{ color: 'icon.muted' }} />
```

### Social Features
```tsx
// Follow action - primary
<PersonAdd color="primary" />

// Following - primary
<PersonOutline color="primary" />

// Friend suggestions - info
<People sx={{ color: 'icon.info' }} />

// Activity feed - primary
<DynamicFeed color="primary" />
```

## Anti-Patterns (Avoid)

❌ **Don't use multiple bright colors in close proximity**
```tsx
// Bad: Too many competing colors
<Star color="secondary" />
<TrendingUp color="error" />
<CheckCircle color="primary" />
```

✅ **Do establish hierarchy with one accent**
```tsx
// Good: Clear focal point
<Star color="secondary" />
<Info sx={{ color: 'icon.muted' }} />
<MoreVert sx={{ color: 'icon.muted' }} />
```

❌ **Don't use primary for metadata**
```tsx
// Bad: Too prominent
<LocationOn color="primary" />
```

✅ **Do use muted for descriptive info**
```tsx
// Good: Subtle and clear
<LocationOn sx={{ color: 'icon.muted' }} />
```

## Implementation

### Using Color Prop
```tsx
<IconName color="primary" />
<IconName color="secondary" />
```

### Using Theme Colors
```tsx
<IconName sx={{ color: 'icon.muted' }} />
<IconName sx={{ color: 'icon.success' }} />
<IconName sx={{ color: 'icon.warning' }} />
<IconName sx={{ color: 'icon.error' }} />
<IconName sx={{ color: 'icon.info' }} />
```

### Responsive to Theme Mode
All icon colors automatically adapt to light/dark mode through the theme system - no additional code needed!

## Quick Reference

| Context | Icon Purpose | Color |
|---------|-------------|-------|
| Navigation | Core features | `primary` |
| CTA | Create, RSVP, Featured | `secondary` |
| Metadata | Location, time, capacity | `icon.muted` |
| Confirmation | Success, verified | `icon.success` |
| Alert | Warnings, time-sensitive | `icon.warning` |
| Error | Cancel, delete, fail | `icon.error` |
| Help | Info, tooltips, hints | `icon.info` |

---

**Remember:** Icons are visual cues that guide users. Use color purposefully to create clear hierarchies and intuitive interfaces.
