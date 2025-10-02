import React, { useState } from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/Form";
import { Input } from "./ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Checkbox } from "./ui/Checkbox";
import { Textarea } from "./ui/Textarea";
import { RadioGroup, RadioGroupItem } from "./ui/RadioGroup";
import { Label } from "./ui/Label";
import { Switch } from "./ui/Switch";

interface InputProps {
  type: "input" | "select" | "checkbox" | "switch" | "radio" | "textarea";
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  inputType?: "text" | "email" | "password" | "date" | "number";
  selectList?: { label: string; value: string }[];
  defaultValue?: string;
  data?: { label: string; value: string }[];
  setWorkSchedule?: React.Dispatch<React.SetStateAction<Day[]>>;
}

type Day = {
  day: string;
  start_time?: string;
  close_time?: string;
};

const RenderInput = ({ field, props }: { field: any; props: InputProps }) => {
  switch (props.type) {
    case "input":
      return (
        <FormControl>
          <Input
            type={props.inputType}
            placeholder={props.placeholder}
            className="bg-input text-foreground"
            {...field}
          />
        </FormControl>
      );

    case "select":
      return (
        <Select onValueChange={field.onChange} value={field?.value}>
          <FormControl>
            <SelectTrigger className="bg-input text-foreground">
              <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent className="bg-card text-card-foreground">
            {props.selectList?.map((i, id) => (
              <SelectItem key={id} value={i.value}>
                {i.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case "checkbox":
      return (
        <div className="flex items-start space-x-2">
          <Checkbox
            id={props.name}
            onCheckedChange={(checked) =>
              field.onChange(checked === true || null)
            }
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor={props.name}
              className="cursor-pointer text-sm font-medium text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {props.label}
            </label>
            <p className="text-sm text-muted-foreground">
              {props.placeholder}
            </p>
          </div>
        </div>
      );

    case "radio":
      return (
        <div className="w-full">
          <FormLabel className="text-foreground">{props.label}</FormLabel>
          <RadioGroup
            defaultValue={props.defaultValue}
            onChange={field.onChange}
            className="flex gap-4"
          >
            {props?.selectList?.map((i, id) => (
              <div className="flex items-center w-full" key={id}>
                <RadioGroupItem
                  value={i.value}
                  id={i.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={i.value}
                  className="flex flex-1 items-center justify-center rounded-md border-2 border-border bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary-foreground text-foreground"
                >
                  {i.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );

    case "textarea":
      return (
        <FormControl>
          <Textarea
            placeholder={props.placeholder}
            className="bg-input text-foreground"
            {...field}
          />
        </FormControl>
      );

    case "switch":
      if (!props.data || !props.setWorkSchedule) return null;

      const handleToggle = (day: string, checked: boolean) => {
        props.setWorkSchedule?.((prevDays) => {
          if (checked) {
            return [
              ...prevDays.filter((d) => d.day !== day),
              { day, start_time: "09:00", close_time: "17:00" },
            ];
          } else {
            return prevDays.filter((d) => d.day !== day);
          }
        });
      };

      const handleTimeChange = (
        day: string,
        fieldKey: "start_time" | "close_time",
        value: string
      ) => {
        props.setWorkSchedule?.((prevDays) =>
          prevDays.map((d) =>
            d.day === day ? { ...d, [fieldKey]: value } : d
          )
        );
      };

      return (
        <div className="space-y-4">
          {props.data.map((el, id) => {
            const [enabled, setEnabled] = useState(false);

            return (
              <div
                key={id}
                className="flex flex-col gap-2 border-t border-border pt-3"
              >
                <div className="flex items-center gap-3">
                  <Switch
                    id={el.value}
                    checked={enabled}
                    onCheckedChange={(checked) => {
                      setEnabled(checked);
                      handleToggle(el.value, checked);
                    }}
                  />
                  <Label htmlFor={el.value} className="capitalize text-foreground">
                    {el.label}
                  </Label>
                </div>

                {!enabled ? (
                  <p className="text-muted-foreground text-sm italic pl-10">
                    Not working on this day
                  </p>
                ) : (
                  <div className="flex items-center gap-2 pl-10">
                    <Input
                      type="time"
                      defaultValue="09:00"
                      className="bg-input text-foreground"
                      onChange={(e) =>
                        handleTimeChange(el.value, "start_time", e.target.value)
                      }
                    />
                    <Input
                      type="time"
                      defaultValue="17:00"
                      className="bg-input text-foreground"
                      onChange={(e) =>
                        handleTimeChange(el.value, "close_time", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );

    default:
      return null;
  }
};

export const CustomInput = (props: InputProps) => {
  const { name, label, control, type } = props;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {type !== "radio" && type !== "checkbox" && type !== "switch" && (
            <FormLabel className="text-foreground">{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />
          <FormMessage className="text-muted-foreground" />
        </FormItem>
      )}
    />
  );
};
