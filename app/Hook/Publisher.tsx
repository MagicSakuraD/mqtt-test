"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

import { IClientSubscribeOptions } from "mqtt";

const formSchema = z.object({
  topic: z.string().min(2).max(50),
  qos: z.number().min(0).max(2),
  payload: z.string().min(2),
});

interface ProfileFormProps {
  publish: (publish: {
    topic: string;
    qos: IClientSubscribeOptions["qos"];
    payload: string;
  }) => void;
}

export function ProfileForm({ publish }: ProfileFormProps) {
  // 1. Define your form.
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "testtopic/1",
      qos: 0,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    publish(values as any);
    toast({
      description: "发布成功📢",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>发布主题</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>主题</FormLabel>
                  <FormControl>
                    <Input placeholder="testtopic/2" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>QoS</FormLabel>
                  <FormControl>
                    <Input placeholder="0" {...field} type="number" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payload"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>消息</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="输入json格式的消息"
                      {...field}
                      className="h-64"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">发布</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export interface PublisherProps {
  publish: (publish: {
    topic: string;
    qos: IClientSubscribeOptions["qos"];
    payload: string;
  }) => void;
}
const Publisher = ({ publish }: PublisherProps) => {
  return (
    <div>
      <ProfileForm publish={publish} />
    </div>
  );
};
export default Publisher;
