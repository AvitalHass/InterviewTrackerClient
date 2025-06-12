interface CredentialResponse {
    credential: string;
    select_by: string;
}

interface GsiButtonConfiguration {
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: string;
    shape?: string;
    width?: number;
}

interface Window {
    google?: {
        accounts: {
            id: {
                initialize: (input: {
                    client_id: string;
                    callback: (response: CredentialResponse) => void;
                }) => void;
                renderButton: (
                    parent: HTMLElement,
                    options: GsiButtonConfiguration
                ) => void;
                prompt: () => void;
            };
        };
    };
}