"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import CopyButton from "@/components/ui/CopyButton";
import Dropdown from "@/components/ui/Dropdown";

const LOREM_SENTENCES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Curabitur pretium tincidunt lacus, nec gravida lectus fermentum vel.",
  "Praesent commodo cursus magna, vel scelerisque nisl consectetur et.",
  "Donec sed odio dui, ut fermentum massa justo sit amet risus.",
  "Maecenas sed diam eget risus varius blandit sit amet non magna.",
  "Nullam quis risus eget urna mollis ornare vel eu leo.",
  "Vestibulum id ligula porta felis euismod semper.",
  "Aenean lacinia bibendum nulla sed consectetur.",
  "Cras mattis consectetur purus sit amet fermentum.",
  "Integer posuere erat a ante venenatis dapibus posuere velit aliquet.",
  "Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.",
  "Morbi leo risus, porta ac consectetur ac, vestibulum at eros.",
  "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.",
  "Etiam porta sem malesuada magna mollis euismod.",
  "Donec ullamcorper nulla non metus auctor fringilla.",
  "Nulla vitae elit libero, a pharetra augue.",
  "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
  "Pellentesque ornare sem lacinia quam venenatis vestibulum.",
  "Sed posuere consectetur est at lobortis.",
  "Aenean eu leo quam pellentesque ornare.",
  "Praesent blandit laoreet nibh, non congue neque tempor nec.",
  "Suspendisse potenti, nec semper risus volutpat quis.",
  "Aliquam erat volutpat, non dignissim nisl pretium et.",
  "Phasellus iaculis neque ac tristique tempus.",
  "Quisque cursus, metus vitae pharetra auctor, sem massa mattis sem.",
  "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit.",
];

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "reprehenderit", "voluptate", "velit",
  "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat",
  "cupidatat", "non", "proident", "sunt", "culpa", "officia", "deserunt", "mollit",
  "anim", "id", "est", "laborum", "curabitur", "pretium", "tincidunt", "lacus",
  "praesent", "cursus", "scelerisque", "nisl", "donec", "odio", "fermentum",
  "massa", "justo", "risus", "maecenas", "diam", "blandit", "nullam", "urna",
  "mollis", "ornare", "leo", "vestibulum", "ligula", "porta", "felis", "euismod",
  "semper", "aenean", "lacinia", "bibendum", "cras", "mattis", "purus", "integer",
  "posuere", "erat", "ante", "venenatis", "dapibus", "vivamus", "sagittis",
  "augue", "laoreet", "rutrum", "faucibus", "auctor", "morbi", "ac", "fusce",
  "tellus", "tortor", "mauris", "condimentum", "nibh", "etiam", "sem", "malesuada",
  "ullamcorper", "metus", "fringilla", "vitae", "libero", "pharetra",
];

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateParagraphs(count: number): string {
  const paragraphs: string[] = [];
  for (let i = 0; i < count; i++) {
    const sentenceCount = 4 + Math.floor(Math.random() * 4); // 4-7 sentences
    const sentences = shuffled(LOREM_SENTENCES).slice(0, sentenceCount);
    // Always start with "Lorem ipsum..." for first paragraph
    if (i === 0 && !sentences[0].startsWith("Lorem ipsum")) {
      const loremIdx = sentences.findIndex((s) => s.startsWith("Lorem ipsum"));
      if (loremIdx > 0) {
        [sentences[0], sentences[loremIdx]] = [sentences[loremIdx], sentences[0]];
      } else {
        sentences[0] = LOREM_SENTENCES[0];
      }
    }
    paragraphs.push(sentences.join(" "));
  }
  return paragraphs.join("\n\n");
}

function generateSentences(count: number): string {
  const sentences: string[] = [];
  let pool = shuffled(LOREM_SENTENCES);
  for (let i = 0; i < count; i++) {
    if (i >= pool.length) {
      pool = shuffled(LOREM_SENTENCES);
    }
    sentences.push(pool[i % pool.length]);
  }
  // Always start with "Lorem ipsum..."
  if (count > 0 && !sentences[0].startsWith("Lorem ipsum")) {
    const idx = sentences.findIndex((s) => s.startsWith("Lorem ipsum"));
    if (idx > 0) {
      [sentences[0], sentences[idx]] = [sentences[idx], sentences[0]];
    } else {
      sentences[0] = LOREM_SENTENCES[0];
    }
  }
  return sentences.join(" ");
}

function generateWords(count: number): string {
  const words: string[] = [];
  let pool = shuffled(LOREM_WORDS);
  for (let i = 0; i < count; i++) {
    if (i >= pool.length) {
      pool = shuffled(LOREM_WORDS);
    }
    words.push(pool[i % pool.length]);
  }
  // Capitalize first word
  if (words.length > 0) {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }
  // Always start with "Lorem ipsum" if count >= 2
  if (count >= 2) {
    words[0] = "Lorem";
    words[1] = "ipsum";
  } else if (count === 1) {
    words[0] = "Lorem";
  }
  return words.join(" ") + ".";
}

const typeOptions = [
  { label: "Paragraphs", value: "paragraphs" },
  { label: "Sentences", value: "sentences" },
  { label: "Words", value: "words" },
];

export default function LoremIpsumGenerator() {
  const [type, setType] = useState("paragraphs");
  const [count, setCount] = useState("3");
  const [output, setOutput] = useState("");

  function handleGenerate() {
    const num = Math.max(1, Math.min(20, parseInt(count) || 1));
    switch (type) {
      case "paragraphs":
        setOutput(generateParagraphs(num));
        break;
      case "sentences":
        setOutput(generateSentences(num));
        break;
      case "words":
        setOutput(generateWords(num));
        break;
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-40">
          <Dropdown
            id="lorem-type"
            label="Type"
            options={typeOptions}
            value={type}
            onChange={(val) => setType(val)}
          />
        </div>
        <div className="w-28">
          <Input
            id="lorem-count"
            label="Count (1-20)"
            type="number"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(e.target.value)}
          />
        </div>
        <Button variant="primary" onClick={handleGenerate}>
          Generate
        </Button>
        <CopyButton text={output} />
      </div>

      {output && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 sm:p-6 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
