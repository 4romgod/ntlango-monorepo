import Image from 'next/image';
import Link from 'next/link';
import {
  CalendarIcon,
  CheckCircleIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';

export default function EventSmallBox({ event }: any) {
  const { title, organizers, startDate, endDate, rSVPs } = event;
  const organizersText =
    organizers?.reduce((text: string, curr: string) => `${text} and ${curr}`) ??
    '';

  return (
    <Link href={`/ntlango`}>
      <div
        className={`
          bg-scale-100 dark:bg-scale-300 hover:bg-scale-200 hover:dark:bg-scale-400 group flex
          h-full w-full
          flex-row gap-2
          rounded border px-6
          py-6 shadow 
          transition-all 
          hover:shadow-lg
          sm:flex-col
        `}
      >
        <div className="w-1/3 sm:w-full">
          <Image
            src="/hero-desktop.png"
            alt="Screenshots of the dashboard project"
            width={500}
            height={500}
            layout="responsive"
            quality={65}
          />
        </div>
        <div className="pt-2">
          <div>
            <h4 className="block truncate font-bold">{title}</h4>
          </div>
          <div>
            <p className="block truncate text-base">
              Hosted by: {organizersText}
            </p>
          </div>
          <div className="flex flex-row">
            <CalendarIcon className="mr-2 h-6 w-5" />
            <p>{startDate}</p>
          </div>
          <div className="flex flex-row">
            <CheckCircleIcon className="mr-2 h-6 w-5" />
            <p>{rSVPs.length ?? 0} RSVP&apos;s</p>
          </div>
          <div className="flex flex-row">
            <TicketIcon className="mr-2 h-6 w-5" />
            <p>Free</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
