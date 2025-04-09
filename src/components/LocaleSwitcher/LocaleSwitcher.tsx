'use client';

import { useLocale } from 'next-intl';
import {FC, useState} from 'react';

import classes from './LocaleSwitcher.module.css'

import { localesMap } from '@/core/i18n/config';
import { setLocale } from '@/core/i18n/locale';
import { Locale } from '@/core/i18n/types';
import {Button, Group, Menu, useDirection, Text} from "@mantine/core";
import {IconChevronDown} from "@tabler/icons-react";

export const LocaleSwitcher: FC = () => {
  const locale = useLocale();

  const { toggleDirection } = useDirection()
  const [opened, setOpened] = useState(false)

  const changeLanguage = (value: string) => {
    const locale = value as Locale;
    setLocale(locale);

  }

  const selected = localesMap.find((item) => item.value === locale) || localesMap[0]



  const items = localesMap.map((item) => (
      <Menu.Item
          key={item.value}
          leftSection={<Text>{item.emoji}</Text>}
          onClick={() => changeLanguage(item.value)}
      >
        {item.label}
      </Menu.Item>
  ))

  return (
      <Menu
          onClose={() => setOpened(false)}
          onOpen={() => setOpened(true)}
          radius="md"
          width="target"
          withinPortal
      >
        <Menu.Target>
          <Button color="grape" data-expanded={opened || undefined}>
            <Group gap="xs">
              <Text>{selected.emoji}</Text>
              <span>{selected.label}</span>
              <IconChevronDown className={classes.icon} size={16} stroke={1.5} />
            </Group>
          </Button>
        </Menu.Target>
        <Menu.Dropdown>{items}</Menu.Dropdown>
      </Menu>
  );
};
