import {EventCategoryTypeSchema, CreateEventCategoryTypeSchema, UpdateEventCategoryTypeSchema} from '@/validation';
import mongoose from 'mongoose';

describe('Event Category', () => {
    const mockID = new mongoose.Types.ObjectId().toString();

    const getValidEventCategoryInput = () => ({
        id: mockID,
        color: 'red',
        description: 'A valid description',
        iconName: 'icon-name',
        name: 'Category Name',
        slug: 'category-slug',
    });

    describe('EventCategoryTypeSchema', () => {
        it('should validate valid EventCategoryTypeSchema', () => {
            const validInput = getValidEventCategoryInput();
            const {success, error} = EventCategoryTypeSchema.safeParse(validInput);
            expect(success).toBe(true);
        });

        it('should invalidate missing required fields', () => {
            const invalidInput = {};
            const {success, error} = EventCategoryTypeSchema.safeParse(invalidInput);
            expect(success).toBe(false);
            if (error) {
                expect(error.errors.length).toBeGreaterThan(0);
            }
        });

        it('should invalidate invalid id format', () => {
            const invalidInput = {
                ...getValidEventCategoryInput(),
                id: 'invalid-id-format',
            };
            const {success, error} = EventCategoryTypeSchema.safeParse(invalidInput);
            expect(success).toBe(false);
            if (error) {
                expect(error.errors[0].message).toBe('Event Category ID is invalid');
            }
        });
    });

    describe('CreateEventCategoryTypeSchema', () => {
        it('should validate valid CreateEventCategoryTypeSchema', () => {
            const validInput = {
                ...getValidEventCategoryInput(),
                id: undefined,
            };
            const {success, error} = CreateEventCategoryTypeSchema.safeParse(validInput);
            expect(success).toBe(true);
        });

        it('should invalidate missing required fields', () => {
            const invalidInput = {};
            const {success, error} = CreateEventCategoryTypeSchema.safeParse(invalidInput);
            expect(success).toBe(false);
            if (error) {
                expect(error.errors.length).toBeGreaterThan(0);
            }
        });
    });

    describe('UpdateEventCategoryTypeSchema', () => {
        it('should validate valid UpdateEventCategoryTypeSchema', () => {
            const validInput = {
                id: mockID,
                name: 'Updated Category Name',
            };
            const {success, error} = UpdateEventCategoryTypeSchema.safeParse(validInput);
            expect(success).toBe(true);
        });

        it('should invalidate invalid id format', () => {
            const invalidInput = {
                id: 'invalid-id-format',
                name: 'Updated Category Name',
            };
            const {success, error} = UpdateEventCategoryTypeSchema.safeParse(invalidInput);
            expect(success).toBe(false);
            if (error) {
                expect(error.errors[0].message).toBe('Event Category ID is invalid');
            }
        });
    });
});
