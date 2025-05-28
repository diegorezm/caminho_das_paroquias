"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './dropdown.module.css';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export default function Dropdown({ trigger, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Function to toggle the dropdown's open state
  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      {React.isValidElement(trigger) ? (
        React.cloneElement(trigger, {
          onClick: toggleDropdown,
          'aria-haspopup': 'true',
          'aria-expanded': isOpen,
        } as React.HTMLProps<HTMLElement>)
      ) : (
        <span onClick={toggleDropdown} aria-haspopup="true" aria-expanded={isOpen} style={{ cursor: 'pointer' }}>
          {trigger}
        </span>
      )}

      {isOpen && (
        <div className={`${styles.dropdownMenu} ${isOpen ? styles.open : ''}`} role="menu">
          {children}
        </div>
      )}
    </div>
  );
}
