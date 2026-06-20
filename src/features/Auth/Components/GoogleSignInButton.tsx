import { useEffect, useRef } from "react";

interface GoogleCredentialResponse {
    credential: string;
}

interface GoogleAccountsId {
    initialize: (config: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
    }) => void;
    renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
}

declare global {
    interface Window {
        google?: {
            accounts: {
                id: GoogleAccountsId;
            };
        };
    }
}

interface GoogleSignInButtonProps {
    onCredential: (idToken: string) => void;
    disabled?: boolean;
}

export default function GoogleSignInButton({ onCredential, disabled }: GoogleSignInButtonProps) {
    const buttonRef = useRef<HTMLDivElement>(null);
    const onCredentialRef = useRef(onCredential);
    onCredentialRef.current = onCredential;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

    useEffect(() => {
        if (!clientId || disabled || !buttonRef.current) {
            return;
        }

        let cancelled = false;

        const render = () => {
            if (cancelled || !window.google || !buttonRef.current) {
                return;
            }

            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: (response) => onCredentialRef.current(response.credential),
            });

            buttonRef.current.innerHTML = "";
            window.google.accounts.id.renderButton(buttonRef.current, {
                theme: "outline",
                size: "large",
                width: 320,
                text: "continue_with",
            });
        };

        if (window.google) {
            render();
        } else {
            const interval = setInterval(() => {
                if (window.google) {
                    clearInterval(interval);
                    render();
                }
            }, 100);

            return () => {
                cancelled = true;
                clearInterval(interval);
            };
        }

        return () => {
            cancelled = true;
        };
    }, [clientId, disabled]);

    if (!clientId) {
        return null;
    }

    return <div ref={buttonRef} className="flex w-full justify-center" />;
}
