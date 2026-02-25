import { RRule } from 'rrule';
import { upperFirst } from 'lodash';
import { logger } from '@/lib/utils';

export const formatRecurrenceRule = (rule?: string | null): string => {
  if (!rule) {
    return 'Schedule coming soon';
  }

  try {
    return upperFirst(RRule.fromString(rule).toText());
  } catch (error) {
    logger.error('Unable to parse recurrence rule', error);
    return 'Schedule coming soon';
  }
};
