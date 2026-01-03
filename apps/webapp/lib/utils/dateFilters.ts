import { DATE_FILTER_OPTIONS, type DateFilterOption } from '@ntlango/commons/lib/constants';

/**
 * Get date range for a filter option
 * Returns ISO 8601 formatted date strings for GraphQL
 */
export function getDateRangeForFilter(
  filterOption: DateFilterOption,
  customDate?: Date
): { startDate: string; endDate: string } {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let start: Date;
  let end: Date;

  switch (filterOption) {
    case DATE_FILTER_OPTIONS.TODAY: {
      start = new Date(now);
      end = new Date(now);
      end.setHours(23, 59, 59, 999);
      break;
    }

    case DATE_FILTER_OPTIONS.TOMORROW: {
      start = new Date(now);
      start.setDate(start.getDate() + 1);
      end = new Date(start);
      end.setHours(23, 59, 59, 999);
      break;
    }

    case DATE_FILTER_OPTIONS.THIS_WEEK: {
      start = new Date(now);
      const dayOfWeek = start.getDay();
      start.setDate(start.getDate() - dayOfWeek);
      
      end = new Date(start);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }

    case DATE_FILTER_OPTIONS.THIS_WEEKEND: {
      start = new Date(now);
      const dayOfWeek = start.getDay();
      
      if (dayOfWeek < 6) {
        start.setDate(start.getDate() + (6 - dayOfWeek));
      } else if (dayOfWeek === 0) {
        start.setDate(start.getDate() - 1);
      }
      
      end = new Date(start);
      end.setDate(end.getDate() + 1);
      end.setHours(23, 59, 59, 999);
      break;
    }

    case DATE_FILTER_OPTIONS.THIS_MONTH: {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    }

    case DATE_FILTER_OPTIONS.CUSTOM: {
      if (!customDate) {
        throw new Error('Custom date filter requires a customDate parameter');
      }
      start = new Date(customDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(customDate);
      end.setHours(23, 59, 59, 999);
      break;
    }

    default:
      throw new Error(`Unknown date filter option: ${filterOption}`);
  }

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
}
