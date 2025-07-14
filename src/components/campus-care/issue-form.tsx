'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createIssueAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import type { Issue } from '@/lib/types';

const formSchema = z.object({
  description: z.string().min(10, {
    message: 'Please provide a detailed description (at least 10 characters).',
  }),
});

type IssueFormProps = {
  onIssueCreated: (issue: Issue) => void;
};

export function IssueForm({ onIssueCreated }: IssueFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const newIssue = await createIssueAction(values);
        onIssueCreated(newIssue);
        toast({
          title: 'Success!',
          description: 'Your maintenance request has been submitted.',
        });
        form.reset();
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description:
            error instanceof Error ? error.message : 'Could not submit the issue. Please try again.',
        });
      }
    });
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="font-headline text-xl">New Maintenance Request</CardTitle>
        <CardDescription>
          Describe your issue in detail. Our AI will analyze it and our team will review it shortly.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., The sink in the 2nd floor women's bathroom is leaking."
                      className="resize-none"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send />
              )}
              <span>{isPending ? 'Submitting...' : 'Submit Request'}</span>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
