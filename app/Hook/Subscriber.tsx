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
import { IClientSubscribeOptions } from "mqtt";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  topic: z.string().min(2).max(50),
  qos: z.number().min(0).max(2),
});

interface ProfileFormProps {
  sub_form: (subscription: {
    topic: string;
    qos: IClientSubscribeOptions["qos"];
  }) => void;
  showUnsub: boolean;
  unSub: (subscription: {
    topic: string;
    qos: IClientSubscribeOptions["qos"];
  }) => void;
}

export function ProfileForm({ sub_form, showUnsub, unSub }: ProfileFormProps) {
  // 1. Define your form.
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
    sub_form(values as any);
    console.log(sub_form);
    console.log(sub_form(values as any));
  }

  const handleUnsub = () => {
    const values = form.getValues();
    unSub(values as any);
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>订阅主题</CardTitle>
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
                    <Input placeholder="testtopic/1" {...field} />
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
            <Button type="submit">订阅</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {showUnsub ? (
          <Button variant="outline" onClick={handleUnsub}>
            取消订阅
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}

interface SubscriberProps {
  sub: (subscription: {
    topic: string;
    qos: IClientSubscribeOptions["qos"];
  }) => void;
  showUnsub: boolean;
  unSub: (subscription: {
    topic: string;
    qos: IClientSubscribeOptions["qos"];
  }) => void;
}

const Subscriber: React.FC<SubscriberProps> = ({ sub, showUnsub, unSub }) => {
  return (
    <div>
      <ProfileForm sub_form={sub} showUnsub={showUnsub} unSub={unSub} />
    </div>
  );
};
export default Subscriber;
