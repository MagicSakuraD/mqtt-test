import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ReceiverProps {
  payload: {
    topic: string;
    message: string;
  };
}

const Receiver = ({ payload }: ReceiverProps) => {
  //   const [messages, setMessages] = useState([]);
  const [messages, setMessages] = useState<
    { topic: string; message: string }[]
  >([]);
  useEffect(() => {
    if (payload.topic) {
      setMessages((messages) => [...messages, payload]);
    }
  }, [payload]);

  return (
    <Card className="w-[350px] h-fit">
      <CardHeader>
        <CardTitle>消息内容</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[35rem] w-[300px] rounded-md border p-4">
          {messages.map((mes, index) => (
            <>
              <div key={index} className="text-sm">
                {mes.topic}: {mes.message}
              </div>

              <Separator className="my-2" />
            </>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
export default Receiver;
