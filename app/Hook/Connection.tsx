"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useEffect, useState } from "react";
import mqtt, { MqttClient } from "mqtt";
import { connect } from "mqtt";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { IClientSubscribeOptions } from "mqtt";
import { Separator } from "@/components/ui/separator";
import Subscriber from "./Subscriber";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import Receiver from "./Receiver";
import Publisher from "./Publisher";

const formSchema = z.object({
  host: z.string().min(2).max(50),
  port: z.number().min(2),
  clientId: z.string().min(2).max(50),
  username: z.string().min(2).max(50),
  password: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." })
    .max(50),
});

export function ProfileForm() {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState("Connect");
  const [isSubed, setIsSub] = useState(false);
  const [payload, setPayload] = useState({});
  const { toast } = useToast();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // host: process.env.Host,
      host: "192.168.2.108",
      port: 8083,
      clientId: "emqx_next_1",
      username: "chenkun22ddd",
      // password: process.env.MY_PASS,
      password: "cyber22022",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const { host, port, clientId, username, password } = values;
    const url: string = `ws:${host}:${port}/mqtt`;

    const options = {
      clientId,
      username,
      password,
      clean: true,
      reconnectPeriod: 1000, // ms
      connectTimeout: 30 * 1000, // ms
    };
    const mqttConnect = (url: string, options: any) => {
      setConnectStatus("Connecting");

      const res = setClient(connect(url, options));
      return res;
    };
    mqttConnect(url, options);
    toast({
      description: "连接成功✅",
    });
  }

  useEffect(() => {
    if (client) {
      // https://github.com/mqttjs/MQTT.js#event-connect
      client.on("connect", () => {
        setConnectStatus("Connected");
        console.log("connection successful");
      });

      // https://github.com/mqttjs/MQTT.js#event-error
      client.on("error", (err) => {
        console.error("Connection error: ", err);
        client.end();
      });

      // https://github.com/mqttjs/MQTT.js#event-reconnect
      client.on("reconnect", () => {
        setConnectStatus("Reconnecting");
      });

      client.on("message", (topic: string, message) => {
        const payload = { topic, message: message.toString() };
        setPayload(payload);
        console.log(`received message: ${message} from topic: ${topic}`);
      });
    }
  }, [client]);

  function onDisconnect() {
    if (client) {
      try {
        client.end(false, () => {
          setConnectStatus("Connect");
          console.log("disconnected successfully");
          toast({
            description: "断开连接❌",
          });
        });
      } catch (error) {
        console.log("disconnect error:", error);
      }
    }
  }

  const mqttSub = (subscription: {
    topic: string;
    qos: IClientSubscribeOptions["qos"];
  }) => {
    if (client) {
      const { topic, qos } = subscription;
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Subscribe to topics error", error);
          return;
        }
        console.log(`Subscribe to topics: ${topic}`);
        setIsSub(true);
      });
    }
  };

  const mqttUnSub = (subscription: {
    topic: string;
    qos: IClientSubscribeOptions["qos"];
  }) => {
    if (client) {
      const { topic, qos } = subscription;
      client.unsubscribe(topic, { qos }, (error) => {
        if (error) {
          console.log("Unsubscribe error", error);
          return;
        }
        console.log(`unsubscribed topic: ${topic}`);
        setIsSub(false);
      });
    }
  };
  const mqttPublish = (context: {
    topic: string;
    qos: IClientSubscribeOptions["qos"];
    payload: string;
  }) => {
    if (client) {
      // topic, QoS & payload for publishing message
      const { topic, qos, payload } = context;
      client.publish(topic, payload, { qos }, (error) => {
        if (error) {
          console.log("Publish error: ", error);
        }
      });
    }
  };

  return (
    <div className="container flex justify-between w-full h-screen">
      <Card className="w-[330px] h-fit">
        <CardHeader>
          <CardTitle>连接EMQX</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>连接地址</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="h1ee611a.ala.cn-hangzhou.emqxsl.cn"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>端口</FormLabel>
                    <FormControl>
                      <Input placeholder="8804" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>客户端ID</FormLabel>
                    <FormControl>
                      <Input placeholder="mqqtjs_this" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input placeholder="quinn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>密码</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between">
                <Button type="submit">连接</Button>
                <Separator orientation="vertical" />
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <Button onClick={onDisconnect}>断开</Button>
        </CardFooter>
      </Card>

      <Subscriber sub={mqttSub} showUnsub={isSubed} unSub={mqttUnSub as any} />
      <Receiver payload={payload as any} />

      <Publisher publish={mqttPublish} />
    </div>
  );
}

const Connection = () => {
  return (
    <>
      <ProfileForm />
    </>
  );
};
export default Connection;
