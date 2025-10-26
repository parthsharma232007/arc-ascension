import { Avatar } from "@/types";
import allCharacters from "@/assets/all-characters.png";
import sungJinWoo from "@/assets/sung-jin-woo.png";
import tanjiro from "@/assets/tanjiro.png";
import goku from "@/assets/goku.png";
import baki from "@/assets/baki.png";

export const avatars: Avatar[] = [
  // Hero Arc
  {
    id: "sung-jin-woo-hero",
    name: "Sung Jin Woo",
    series: "Solo Leveling",
    imageUrl: sungJinWoo,
    arc: "hero",
  },
  {
    id: "tanjiro",
    name: "Tanjiro Kamado",
    series: "Demon Slayer",
    imageUrl: tanjiro,
    arc: "hero",
  },
  {
    id: "goku",
    name: "Son Goku",
    series: "Dragon Ball",
    imageUrl: goku,
    arc: "hero",
  },
  {
    id: "baki",
    name: "Baki Hanma",
    series: "Baki",
    imageUrl: baki,
    arc: "hero",
  },
  
  // Villain Arc
  {
    id: "sukuna",
    name: "Sukuna",
    series: "Jujutsu Kaisen",
    imageUrl: allCharacters,
    arc: "villain",
  },
  {
    id: "eren",
    name: "Eren Yeager",
    series: "Attack on Titan",
    imageUrl: allCharacters,
    arc: "villain",
  },
  {
    id: "toji",
    name: "Toji Fushiguro",
    series: "Jujutsu Kaisen",
    imageUrl: allCharacters,
    arc: "villain",
  },
  {
    id: "garou",
    name: "Garou",
    series: "One Punch Man",
    imageUrl: allCharacters,
    arc: "villain",
  },
  
  // Redemption Arc
  {
    id: "sung-jin-woo-redemption",
    name: "Sung Jin Woo",
    series: "Solo Leveling",
    imageUrl: allCharacters,
    arc: "redemption",
  },
  {
    id: "saitama",
    name: "Saitama",
    series: "One Punch Man",
    imageUrl: allCharacters,
    arc: "redemption",
  },
  {
    id: "jack",
    name: "Jack Hanma",
    series: "Baki",
    imageUrl: allCharacters,
    arc: "redemption",
  },
  {
    id: "itadori",
    name: "Yuji Itadori",
    series: "Jujutsu Kaisen",
    imageUrl: allCharacters,
    arc: "redemption",
  },
  
  // Winter Arc
  {
    id: "guts",
    name: "Guts",
    series: "Berserk",
    imageUrl: allCharacters,
    arc: "inter",
  },
  {
    id: "yami",
    name: "Yami Sukehiro",
    series: "Black Clover",
    imageUrl: allCharacters,
    arc: "inter",
  },
  {
    id: "vegeta",
    name: "Vegeta",
    series: "Dragon Ball",
    imageUrl: allCharacters,
    arc: "inter",
  },
  {
    id: "yoshikage",
    name: "Yoshikage Kira",
    series: "JoJo's Bizarre Adventure",
    imageUrl: allCharacters,
    arc: "inter",
  },
];
