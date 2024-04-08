import React, { useCallback, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ethers } from "ethers";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
// import { Matcher } from "react-day-picker";
import { format } from "date-fns";

import { CalendarIcon } from "lucide-react";
import { toEther } from "thirdweb";
import { useStateContext } from "../context/state-context-provider";
import { money } from "../assets";
import { Loader } from "../components/loader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { checkIfImage } from "../utils";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/create-campaign-details")({
  component: CreateCampaignDetails,
});

const formSchema = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string(),
  target: z.string(),
  deadline: z.date(),
  image: z.string().url(),
});

type FormSchemaProps = z.infer<typeof formSchema>;

function CreateCampaignDetails() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const form = useForm<FormSchemaProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      title: "",
      description: "",
      target: "",
      deadline: new Date(),
      image: "",
    },
  });

  // 2. Define a submit handler.
  const handleSubmit: SubmitHandler<FormSchemaProps> = useCallback((values) => {
    console.log("🚀 ~ consthandleSubmit:SubmitHandler<FormSchemaProps>=useCallback ~ values:", values)
    const image = values.image;
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    checkIfImage(values.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await createCampaign({
          ...values,
          target: ethers.utils.parseEther(values.target).toString(),
        });
        setIsLoading(false);
        navigate({ to: "/" });
      } else {
        alert("Provide valid image URL");
        form.reset({ ...values, image: "" });
      }
    });
  }, []);

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
          Start a Campaign
        </h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="w-full mt-[65px] flex flex-col gap-[30px]"
        >
          <div className="flex flex-col md:flex-row gap-[40px]">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Your Name *</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full"
                      placeholder="John Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your name. It will be displayed on the campaign
                    page.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Campaign Title *</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full"
                      placeholder="Write a title"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the title of your campaign. It should be short and
                    descriptive.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Story *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your story"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Tell people why they should support your campaign. This is
                  your chance to inspire others.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
            <img
              src={money}
              alt="money"
              className="w-[40px] h-[40px] object-contain"
            />
            <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
              You will get 100% of the raised amount
            </h4>
          </div>
          <div className="flex flex-col md:flex-row items-center w-full gap-[40px]">
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Goal *</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full"
                      placeholder="ETH 0.50"
                      step={0.01}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the amount you need to raise for your campaign.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>End Date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value as unknown as Date | undefined}
                        onSelect={field.onChange}
                        disabled={(date) =>
                           date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This the date your campaign will end.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Campaign image *</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="Place image URL of your campaign"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is the amount you need to raise for your campaign.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center items-center mt-[40px]">
            <Button
              className="bg-[#1dc071] shadow-xl rounded-lg text-lg w-56  text-primary"
              type="submit"
            >
              Submit new campaign
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
