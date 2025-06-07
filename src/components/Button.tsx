import React from 'react';
import classNames from 'classnames';
import styles from './Button.module.css';
import type { ButtonProps } from '../types';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  border,
  onClick,
  children,
  className = '',
}) => {
  const sizeClass = size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;

  const variantClass =
    variant === 'secondary'
      ? styles.variantSecondary
      : variant === 'outline'
        ? styles.variantOutline
        : styles.variantPrimary;

  const borderClass =
    border === 'primary' ? styles.borderPrimary : border === 'secondary' ? styles.borderSecondary : '';

  const combined = classNames(styles.buttonBase, sizeClass, variantClass, borderClass, className);

  return (
    <button onClick={onClick} className={combined}>
      {children}
    </button>
  );
};

export default Button;
