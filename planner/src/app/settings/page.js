// settings
// currently set color and phrase to be used on "ranking page". will this be useful else where? should i split color and phrase?
// max length of phrase very short. revisit?
"use client"

import Image from "next/image";
import styles from "../page.module.css";
import {   
  Button,
  Flex,
  IconButton,
  Input,
  UnorderedList,
  Spacer } from '@chakra-ui/react';
  import { CloseIcon } from '@chakra-ui/icons'
import { paletteData } from '../utils/mockData.js';
import getRandomColor from '../utils/tempFunc.js';
import React, { useState } from "react";

export default function SettingsPage() {
  //set local state
  const [palette, setPalette] = useState(paletteData);

  const paletteAdd = () => {
    //. set max palette size? if (palette.length <= 10)
    setPalette([...palette, {color: getRandomColor(), variable: null}])
  }

  const paletteDel = (index) => {
    setPalette(palette => {
      return palette.filter((item,i) => i !== index)
    })
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          Settings
          <li>
            Will settings be different for every page?
          </li>
          <li>
            Save button not hooked up
          </li>
        </ol>

        <Button onClick={paletteAdd} height='20px'> + </Button>

        <UnorderedList> 
          {palette.map((paletteVals, i) => {
            return <Flex key={`${paletteVals.color}-${paletteVals.variable}`} align='center' padding='1'>
              <IconButton onClick={() => paletteDel(i)} flex='1' icon={<CloseIcon />} colorScheme='red' size='xs' variant='solid' height='20px' />

              <Spacer />
              <input flex='1' type="color" id="body" name="body" defaultValue={paletteVals.color} />
              <Spacer />

              <Input flex='4' defaultValue={paletteVals.variable} placeholder='...' variant='outline' maxLength={5} />
            </Flex>
          })}
        </UnorderedList>

        <Button colorScheme='green'>Save</Button>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
