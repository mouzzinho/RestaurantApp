import React from 'react';
import Link from 'next/link';

import styles from './button.module.scss';

import Loader from '../../../public/loader.svg';

interface IButtonProps extends React.HTMLProps<HTMLButtonElement> {
    className?: string;
    onClick?: () => void;
    type?: 'button' | 'submit';
    as?: 'button' | 'link';
    to?: string;
    isActive?: boolean;
    rest?: IButtonProps;
    children?: React.ReactNode;
    isLoading?: boolean;
}

const Button: React.FC<IButtonProps> = ({ className = '', onClick, type = 'button', as = 'button', to, isActive, children, isLoading, ...rest }) => {
    if (as === 'link' && to) {
        return (
            <Link className={`${className} ${styles.button} ${isActive ? `${styles.active} active` : ''}`} href={to}>
                {children}
            </Link>
        );
    }

    return (
        <button className={`${className} ${styles.button} ${isActive ? `${styles.active} active` : ''}`} onClick={onClick} type={type} {...rest}>
            {isLoading ? <Loader className={styles.loader} /> : children}
        </button>
    );
};

export default Button;
