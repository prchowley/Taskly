import { useForm } from "@tanstack/react-form";
import type { AnyFieldApi } from '@tanstack/react-form'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAddTodo, useDisplayContext } from "@/store/Hooks";

function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <>
            {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <em>{field.state.meta.errors.join(',')}</em>
            ) : null}
            {field.state.meta.isValidating ? 'Validating...' : null}
        </>
    )
}

export default function AddTodo() {

    const { displayType } = useDisplayContext();
    const addTodo = useAddTodo(displayType);

    const form = useForm({
        defaultValues: {
            task: '',
        },
        onSubmit: async ({ value }) => {
            await addTodo.mutateAsync(value.task)
            form.setFieldValue('task', '');
        },
    })

    return (
        <form onSubmit={form.handleSubmit} method="dialog" className="w-full flex justify-center">
            <div className="mb-4 flex gap-2 items-start w-full max-w-xl justify-center mt-4">
                <form.Field
                    name="task"
                    validators={{
                        onChangeAsyncDebounceMs: 1000,
                        onChange: ({ value }) =>
                            !value
                                ? 'A task name is required'
                                : value.length < 3
                                    ? 'Task name must be at least 3 characters'
                                    : undefined,
                    }}
                    children={(field) => {
                        return (
                            <div className="flex-1 flex flex-col gap-1 items-center">
                                <Input
                                    id={field.name}
                                    placeholder="Enter a task"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    className="bg-white"
                                />
                                <FieldInfo field={field} />
                            </div>
                        )
                    }}
                />
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting, state.values.task]}
                    children={([canSubmit, isSubmitting, task]) => (
                        <div className="flex gap-2 items-center">
                            <Button variant="default" type="submit"
                                disabled={!canSubmit || !(typeof task === 'string' && task.trim())}
                                className="w-24 border border-black-200 bg-white hover:bg-gray-200"
                            >
                                {isSubmitting ? '...' : 'Add'}
                            </Button>
                        </div>
                    )}
                />
            </div>
        </form>
    )
}
