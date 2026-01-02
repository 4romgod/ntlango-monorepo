import {createEventPipelineStages} from '@/utils';
import {PipelineStage} from 'mongoose';
import {FilterInput} from '@ntlango/commons/types';
import {FilterOperatorInput} from '@ntlango/commons/types';

describe('createEventPipelineStages', () => {
  it('should return a valid pipeline for simple equality filters', () => {
    const filters: FilterInput[] = [
      {
        field: 'status',
        value: 'Completed',
        operator: FilterOperatorInput.eq,
      },
    ];
    const expectedPipeline: PipelineStage[] = [
      {
        $match: {
          status: {$eq: 'Completed'},
        },
      },
    ];

    const pipelineStages = createEventPipelineStages(filters);
    expect(pipelineStages).toEqual(expectedPipeline);
  });

  it('should return a valid pipeline for nested field filters', () => {
    const filters: FilterInput[] = [{field: 'organizers.email', value: 'jay@rocknation.com', operator: FilterOperatorInput.eq}];
    const expectedPipeline: PipelineStage[] = [
      {
        $match: {
          'organizers.email': {$eq: 'jay@rocknation.com'},
        },
      },
    ];

    const pipelineStages = createEventPipelineStages(filters);
    expect(pipelineStages).toEqual(expectedPipeline);
  });

  it('should return a valid pipeline for different operators', () => {
    const filters: FilterInput[] = [{field: 'capacity', value: 50, operator: FilterOperatorInput.gt}];
    const expectedPipeline: PipelineStage[] = [
      {
        $match: {
          capacity: {$gt: 50},
        },
      },
    ];

    const pipelineStages = createEventPipelineStages(filters);
    expect(pipelineStages).toEqual(expectedPipeline);
  });

  it('should handle multiple filters correctly', () => {
    const filters: FilterInput[] = [
      {field: 'status', value: 'Completed', operator: FilterOperatorInput.eq},
      {field: 'capacity', value: 50, operator: FilterOperatorInput.gte},
    ];
    const expectedPipeline: PipelineStage[] = [
      {
        $match: {
          $and: [
            {status: {$eq: 'Completed'}},
            {capacity: {$gte: 50}},
          ],
        },
      },
    ];

    const pipelineStages = createEventPipelineStages(filters);
    expect(pipelineStages).toEqual(expectedPipeline);
  });

  it('should handle nested field filters with different operators', () => {
    const filters: FilterInput[] = [{field: 'eventCategories.name', value: 'Arts', operator: FilterOperatorInput.ne}];
    const expectedPipeline: PipelineStage[] = [
      {
        $match: {
          'eventCategories.name': {$ne: 'Arts'},
        },
      },
    ];

    const pipelineStages = createEventPipelineStages(filters);
    expect(pipelineStages).toEqual(expectedPipeline);
  });

  it('should use $in when a filter value is an array', () => {
    const filters: FilterInput[] = [
      {field: 'status', value: ['Upcoming', 'Ongoing'], operator: FilterOperatorInput.eq},
    ];
    const expectedPipeline: PipelineStage[] = [
      {
        $match: {
          status: {$in: ['Upcoming', 'Ongoing']},
        },
      },
    ];

    const pipelineStages = createEventPipelineStages(filters);
    expect(pipelineStages).toEqual(expectedPipeline);
  });

  it('should use $nin when a filter value array uses ne operator', () => {
    const filters: FilterInput[] = [
      {field: 'status', value: ['Cancelled', 'Completed'], operator: FilterOperatorInput.ne},
    ];
    const expectedPipeline: PipelineStage[] = [
      {
        $match: {
          status: {$nin: ['Cancelled', 'Completed']},
        },
      },
    ];

    const pipelineStages = createEventPipelineStages(filters);
    expect(pipelineStages).toEqual(expectedPipeline);
  });
});
