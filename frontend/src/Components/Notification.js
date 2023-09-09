import { toast } from 'react-toastify';

export const showSuccessNotification = (message) => {
    toast.success(message, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
    });
};

export const showErrorNotification = (error) => {
    toast.error(error.message || 'An error occurred.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
    });
};

export const showMessage = (message) => {
    toast.error(message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
    });
};
