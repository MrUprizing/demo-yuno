"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from "@/components/ui/color-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const formSchema = z.object({
  primaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be hex"),
  primaryForeground: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be hex"),
  cardColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be hex"),
  cardForeground: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be hex"),
  borderColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be hex"),
  inputColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be hex"),
  mutedColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be hex"),
  accentColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be hex"),
  radiusSize: z.string(),
  ringColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Must be hex"),
});

type FormValues = z.infer<typeof formSchema>;

const STORAGE_KEY = "theme-config";

interface ColorPickerFormDemoProps {
  onSave?: (values: Record<string, string>) => void;
}

function loadTheme(): FormValues | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : null;
}

export function ColorPickerFormDemo({ onSave }: ColorPickerFormDemoProps) {
  const [mounted, setMounted] = React.useState(false);
  const [saved, setSaved] = React.useState<FormValues | null>(null);

  React.useEffect(() => {
    setSaved(loadTheme());
    setMounted(true);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primaryColor: "#000000",
      primaryForeground: "#ffffff",
      cardColor: "#ffffff",
      cardForeground: "#000000",
      borderColor: "#e5e5e5",
      inputColor: "#e5e5e5",
      mutedColor: "#f5f5f5",
      accentColor: "#f5f5f5",
      radiusSize: "0.625rem",
      ringColor: "#000000",
      ...(saved || {}),
    },
  });

  const onSubmit = React.useCallback(
    (input: FormValues) => {
      const mappedVars = {
        "--primary": input.primaryColor,
        "--primary-foreground": input.primaryForeground,
        "--card": input.cardColor,
        "--card-foreground": input.cardForeground,
        "--border": input.borderColor,
        "--input": input.inputColor,
        "--muted": input.mutedColor,
        "--accent": input.accentColor,
        "--radius": input.radiusSize,
        "--ring": input.ringColor,
      };
      onSave?.(mappedVars);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(input));
      toast.success("Theme saved successfully");
    },
    [onSave],
  );

  const onReset = React.useCallback(() => {
    form.reset();
  }, [form]);

  if (!mounted) return null;

  const ColorField = ({
    name,
    label,
  }: {
    name: keyof FormValues;
    label: string;
  }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs">{label}</FormLabel>
          <FormControl>
            <ColorPicker
              value={field.value as string}
              onValueChange={field.onChange}
              defaultFormat="hex"
            >
              <ColorPickerTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-2 py-1 h-8 text-xs"
                >
                  <ColorPickerSwatch className="size-3" />
                  {(field.value as string).substring(0, 7)}
                </Button>
              </ColorPickerTrigger>
              <ColorPickerContent>
                <ColorPickerArea />
                <div className="flex items-center gap-2">
                  <ColorPickerEyeDropper />
                  <div className="flex flex-1 flex-col gap-2">
                    <ColorPickerHueSlider />
                    <ColorPickerAlphaSlider />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ColorPickerFormatSelect />
                  <ColorPickerInput />
                </div>
              </ColorPickerContent>
            </ColorPicker>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Customize Theme</Button>
      </SheetTrigger>
      <SheetContent className="w-96 overflow-y-auto px-6 py-6">
        <SheetHeader className="mb-6">
          <SheetTitle>Theme Settings</SheetTitle>
          <SheetDescription>Customize colors and styles</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <ColorField name="primaryColor" label="Primary" />
              <ColorField name="primaryForeground" label="Primary Text" />
              <ColorField name="cardColor" label="Card Background" />
              <ColorField name="cardForeground" label="Card Text" />
              <ColorField name="borderColor" label="Border" />
              <ColorField name="inputColor" label="Input" />
              <ColorField name="mutedColor" label="Muted" />
              <ColorField name="accentColor" label="Accent" />
              <ColorField name="ringColor" label="Ring" />
            </div>

            <FormField
              control={form.control}
              name="radiusSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Border Radius</FormLabel>
                  <FormControl>
                    <input
                      type="text"
                      placeholder="0.425rem"
                      {...field}
                      className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onReset}
                className="flex-1 text-xs"
              >
                Reset
              </Button>
              <Button type="submit" className="flex-1 text-xs">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}