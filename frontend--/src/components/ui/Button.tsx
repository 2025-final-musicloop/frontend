import React from 'react';
import classNames from 'classnames';
import styles from './Button.module.css';
import type { ButtonProps } from '../../types';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const sizeClass = size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;

  const variantClass =
    variant === 'secondary'
      ? styles.variantSecondary
      : variant === 'outline'
        ? styles.variantOutline
        : variant === 'ghost'
          ? styles.variantGhost
          : styles.variantPrimary;

  const combined = classNames(styles.buttonBase, sizeClass, variantClass, className);

  return (
    <button onClick={onClick} className={combined} disabled={disabled} type={type}>
      {children}
    </button>
  );
};

export default Button;
