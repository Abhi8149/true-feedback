'use client';
import React from 'react';
import dayjs from 'dayjs'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosError } from 'axios';
import { message } from '@/model/User';
import { APIResponse } from '@/types/Apiresponse';

type MessageCardProp = {
    message: message;
    onRemoveMessage: (messageId: string) => void;
};

const MessageCard = ({ message, onRemoveMessage }: MessageCardProp) => {
    const toast = useToast();

    const handleDeleteMessage = async () => {
        try {
            const response = await axios.delete<APIResponse>(`/api/delete-message/${message._id}`);
            toast.toast({
                title: 'Message deleted successfully',
                description: response.data.message,
            });
            onRemoveMessage(message._id);
        } catch (error) {
            const axiosError = error as AxiosError<APIResponse>;
            toast.toast({
                title: 'Error',
                description: axiosError.response?.data.message ?? 'Failed to delete message',
                variant: 'destructive',
            });
        }
    };

    return (
        <div>
            <Card className='relative'>
                <CardHeader>
                    <CardTitle>{message.content}</CardTitle>
                </CardHeader>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className='bg-red-600 absolute top-0 right-0' variant="outline">X</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                message and remove your message from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteMessage}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <div className="text-sm ml-4">
               {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                 </div>
                <CardFooter>
                    {/* <p>Card Footer</p> */}
                </CardFooter>
            </Card>
        </div>
    );
};

export default MessageCard