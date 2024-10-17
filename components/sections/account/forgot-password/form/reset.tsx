import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { resetPasswordSchema } from "@/lib/validations/authSchemas"; // Şema import et
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Şema tanımı
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = ({ onFormSubmit }) => {
    const { toast } = useToast();

    // useForm'u tanımla
    const formPassword = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
        shouldUnregister: false,
    });

    // Şifre sıfırlama işlemi
    const onSubmitPassword = async (data: ResetPasswordFormData) => {
        try {
            await onFormSubmit(data);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Reset Password</h1>
                <p className="text-balance text-muted-foreground">
                    Please enter your new password below to reset your account password.
                </p>
            </div>
            <Form {...formPassword}>
                <form
                    onSubmit={formPassword.handleSubmit(onSubmitPassword)}
                    className="space-y-4"
                >
                    {/* Yeni şifre alanı */}
                    <FormField
                        control={formPassword.control}
                        name="newPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="newPassword">New Password</FormLabel>
                                <FormControl>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="Enter new password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Şifreyi onayla alanı */}
                    <FormField
                        control={formPassword.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel htmlFor="confirmPassword">
                                    Confirm New Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Confirm new password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">
                        Reset Password
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ResetPasswordForm;
