"use client"

import * as React from 'react'
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Users, ShoppingBag, Wallet, Star, Home, CheckCircle, Clock, Settings, Gift, Zap, Award, Layers, Trophy, UserPlus, Volume2, VolumeX, Calendar, Lock, Unlock, Facebook, Twitter, Instagram, Youtube, Send, Coins, Medal, Crown, Code, Anchor, Globe, ArrowRight, Copy } from 'lucide-react'
import Image from 'next/image'
// Remove or comment out this line
// const { theme, setTheme } = useTheme()

// Mocked TelegramWebApp API
const TelegramWebApp = {
  initData: "user_id=12345&username=CryptoEnthusiast",
  sendData: (data: any) => console.log("Sending data to Telegram:", data),
  showAlert: (message: string) => console.log("Telegram Alert:", message),
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => {
    const confirmed = window.confirm(message);
    callback(confirmed);
  },
  ready: () => console.log("Telegram WebApp is ready"),
  expand: () => console.log("Expanding WebApp"),
  close: () => console.log("Closing WebApp"),
  MainButton: {
    text: "Main Button",
    onClick: (callback: () => void) => callback(),
    show: () => console.log("Showing Main Button"),
    hide: () => console.log("Hiding Main Button"),
  },
  BackButton: {
    show: () => console.log("Showing Back Button"),
    hide: () => console.log("Hiding Back Button"),
  },
  onEvent: (eventType: string, callback: () => void) => {
    console.log(`Registered event listener for: ${eventType}`);
    // In a real implementation, we would actually register the event listener here
  },
  getUserName: () => "CryptoEnthusiast",
  getUserProfilePhoto: () => "https://example.com/user_profile_photo.jpg",
  hapticFeedback: {
    impactOccurred: (style: string) => console.log(`Haptic feedback: ${style}`),
  },
  openTelegramLink: (url: string) => window.open(url, '_blank'),
  openLink: (url: string) => window.open(url, '_blank'),
}

const NeonGradientCard = React.memo(({ children, className, ...props }: React.ComponentProps<'div'>) => (
  <div className={`relative overflow-hidden rounded-lg ${className}`} {...props}>
    <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-75 blur-xl"></div>
    <div className="relative z-10 bg-black/80 p-6 rounded-lg">{children}</div>
  </div>
))

const CryptoButton = React.memo(({ icon: Icon, href, text, isActive, setCurrentPage }: { icon: React.ElementType, href: string, text: string, isActive: boolean, setCurrentPage: (page: string) => void }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <Button
      variant="ghost"
      className={`relative w-14 h-14 bg-transparent flex flex-col items-center justify-center`}
      onClick={() => {
        setCurrentPage(href)
        playHeaderFooterSound()
      }}
    >
      <Icon className={`w-8 h-8 mb-1 ${isActive ? 'text-white' : 'text-gray-400'}`} />
      <span className={`text-xs ${isActive ? 'text-white' : 'text-gray-400'}`}>{text}</span>
    </Button>
  </motion.div>
))

const levelRequirements = [
  0, 25000, 300000, 500000, 1000000, 10000000, 50000000, 100000000, 500000000, 1000000000
]

const levelImages = [
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Broke%20Cheetah-AZ7Z66QUFCG9MgyuTsUhX0UQCZJO8I.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mr%20Cheetah-jshDTOdPbnMs3X9l2CfUstx6cwvru5.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sparrow%20Cheetah-UuqPycvFOq1rkira8AC9PN5X1dPN3j.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Vikings%20Cheetah-P6y9skXfIb9Wf4zGk266CKrgkPjnn3.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Samurai%20Cheetah-4nDMYbxrXu9jGVSMZj4NAy43wweimH.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Alien%20Cheetah-2nXw7kegMKYCHkVUlUvFPagBOUZCBi.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Robot%20Cheetah-aVHThrvuE0yPKmKkWPN1otCRsYKye6.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Space%20Cheetah-Bi8hZibJ6TsEp2leQZxo4JNpXGXMAz.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pop%20Star%20Cheetah-N5Lci9F0a84afJeAs6Y10utQmYRMCQ.png",
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Super%20Hero%20Cheetah-StyjPnTOMnsKsJhmveei4RCToBegvb.png"
]

const trophies = [
  { name: "Crypto Novice", description: "First steps into the digital realm", requirement: 5000, prize: 20000, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1T-nUWKYBAKLuUbRUCtQ4Pe6bKVvuayqD.png" alt="Crypto Novice" width={64} height={64} /> },
  { name: "Blockchain Pioneer", description: "Exploring the foundations of crypto", requirement: 50000, prize: 50000, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2T-qkckZRo7F2pFbjOXFUsmZW1aVDaKkX.png" alt="Blockchain Pioneer" width={64} height={64} /> },
  { name: "DeFi Explorer", description: "Venturing into decentralized finance", requirement: 100000, prize: 100000, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3T-S4ZJ26mqOyNGPIIBKrLLwkozCZFPru.png" alt="DeFi Explorer" width={64} height={64} /> },
  { name: "NFT Collector", description: "Embracing the world of digital art", requirement: 250000, prize: 250000, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4T-8R9RicTTe3vC5WD0wWAY7OCNaF1vxx.png" alt="NFT Collector" width={64} height={64} /> },
  { name: "Hodl Master", description: "Showing true diamond hands", requirement: 500000, prize: 500000, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5T-QEssxxIveH9hiQ0nJcZZrmdJJguJbF.png" alt="Hodl Master" width={64} height={64} /> },
  { name: "Altcoin Adventurer", description: "Diversifying beyond Bitcoin", requirement: 1000000, prize: 1000000, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6T-fnsT0zSHQjez6E6KHO3AjIwflnyT1P.png" alt="Altcoin Adventurer" width={64} height={64} /> },
  { name: "Smart Contract Sage", description: "Mastering the art of crypto automation", requirement: 2500000, prize: 2500000, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7T-2DEkkrvJaawGC1O7GADjiHOn8RQfia.png" alt="Smart Contract Sage" width={64} height={64} /> },
  { name: "Crypto Whale", description: "Making waves in the digital ocean", requirement: 5000000, prize: 5000000, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8T-i7iib3r4xoqtY9qYHdrOOgiUflPOCu.png" alt="Crypto Whale" width={64} height={64} /> },
  { name: "Metaverse Mogul", description: "Conquering virtual worlds", requirement: 7500000, prize: 7500000, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9T-FOz1XZIhMkDitSvZsKOFXfYkP6QdQt.png" alt="Metaverse Mogul" width={64} height={64} /> },
  { name: "Crypto Legend", description: "Achieving legendary status in the crypto world", requirement: 10000000, prize: 10000000, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/10-m1ABpvscvGrraWnHOclc7sLK531TqB.png" alt="Crypto Legend" width={64} height={64} /> }
]

const formatNumber = (num: number) => {
  if (num >= 1e18) return (num / 1e18).toFixed(2) + 'Q';
  if (num >= 1e15) return (num / 1e15).toFixed(2) + 'P';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'k';
  return num.toFixed(2);
}

const playCoinSound = () => {
  const audio = new Audio('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Coin%20Button%20Sound-vLxAEYrnFJ4W4ZNzInbVnZpsMhwZLa.mp3')
  audio.play()
}

const playHeaderFooterSound = () => {
  const audio = new Audio('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/All%20Button%20Sound-NecLnCIFTmsT5rZXNgDaGNLmKdTxNO.mp3')
  audio.play()
}

type ShopItem = {
  id: number;
  name: string;
  image: string;
  basePrice: number;
  baseProfit: number;
  level: number;
}

type PremiumShopItem = {
  id: number;
  name: string;
  image: string;
  basePrice: number;
  effect: string;
  level: number;
}

type Task = {
  id: number;
  description: string;
  reward: number;
  progress: number;
  maxProgress?: number;
  completed: boolean;
  claimed: boolean;
  icon: React.ReactNode;
  action: () => void;
}

export default function Game() {
  const [user, setUser] = React.useState({
    name: TelegramWebApp.getUserName(),
    coins: 0,
    rank: 7352,
    level: 1,
    exp: 0,
    profilePhoto: TelegramWebApp.getUserProfilePhoto(),
  })
  const [clickPower, setClickPower] = React.useState(1)
  const [profitPerHour, setProfitPerHour] = React.useState(0)
  const [wallet, setWallet] = React.useState<string | null>(null)
  const [currentPage, setCurrentPage] = React.useState('home')
  const [energy, setEnergy] = React.useState(5000)
  const [maxEnergy] = React.useState(5000)
  const energyRef = React.useRef<HTMLDivElement>(null)
  const [clickEffect, setClickEffect] = React.useState(false)
  const [clickFeedback, setClickFeedback] = React.useState<{ amount: number, position: { x: number, y: number } } | null>(null)
  const [pphAccumulated, setPphAccumulated] = React.useState(0)
  const [showPPHPopup,   setShowPPHPopup] = React.useState(false)
  const [settings, setSettings] = React.useState({
    vibration: true,
    backgroundMusic: false,
    soundEffect: true,
  })
  const [showLevelUpPopup, setShowLevelUpPopup] = React.useState(false)
  const [newLevel, setNewLevel] = React.useState(1)
  const [unlockedLevels, setUnlockedLevels] = React.useState([1])
  const [pphPopupShown, setPphPopupShown] = React.useState(false)
  const [dailyReward, setDailyReward] = React.useState({ lastClaimed: null, streak: 0, day: 1, completed: false })
  const [multiplier, setMultiplier] = React.useState(1)
  const [multiplierEndTime, setMultiplierEndTime] = React.useState<number | null>(null)
  const [multiplierCooldown, setMultiplierCooldown] = React.useState<number | null>(null)
  const [selectedCoinImage, setSelectedCoinImage] = React.useState(levelImages[0])
  const [isLoading, setIsLoading] = React.useState(true)
  const [inviteCode, setInviteCode] = React.useState('CRYPTO123')
  const [friendsCoins, setFriendsCoins] = React.useState<{ [key: string]: number }>({})
  const [dailyChallenge, setDailyChallenge] = React.useState({ task: '', reward: 0, completed: false });
  
  const [congratulationPopup, setCongratulationPopup] = React.useState({ show: false, item: null })
  const [hasShownCongratulationPopup, setHasShownCongratulationPopup] = React.useState(false)
  const [boosterCooldown, setBoosterCooldown] = React.useState<number | null>(null)


  const [shopItems, setShopItems] = React.useState<ShopItem[]>([
    { id: 1, name: "Cheetah's Crypto Cave", image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cheetah\'s%20Crypto%20Cave-eB3Jjfhp3OKWoHzZkYofYq2JvIoFte.jpg',   basePrice: 1000, baseProfit: 500, level: 1 },
    { id: 2, name: "Baby Cheetah Vault", image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Baby%20Cheetah%20Vault-onkCfliqq8Zkv4EH70q1RjevRwpSrS.jpg', basePrice: 2000, baseProfit: 1000, level: 1 },
    { id: 3, name: "Cheetah Coin Corner", image:  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cheetah%20Coin%20Corner-nMIyFzaXX5TkKWs2rtuCgEe3f7xNT4.jpg',   basePrice: 4000, baseProfit: 2000, level: 1 },
    { id:  4, name: "Cheetah's Stellar Fleet", image:   'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cheetah%E2%80%99s%20Stellar%20Fleet-RpIrYyUw2ijaNvNOC29XpaAl538qgI.jpg', basePrice: 8000, baseProfit: 4000, level: 1 },
    { id: 5, name:  "Bugatti  Crypto Orbit", image:       'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bugatti%20Crypto%20Orbit-mKpzDd9UUkgWF8vXui59EjtC2O49E0.jpg', basePrice: 16000, baseProfit: 8000, level: 1  },
  ])

  const [premiumShopItems, setPremiumShopItems] = React.useState<PremiumShopItem[]>([
    { 
      id: 6,
      name: "Quantum Coin Accelerator",
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SpaceXcelerate%20Crypto-0HG6KC5mE8P28FwqDdoyPDRv978heW.jpg',
      basePrice: 2000,
      effect: "Doubles coin button taps",
      level: 1
    },
    { 
      id: 7,
      name: "Hyperdrive Coin Garage",
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hyperdrive%20Coin%20Garage-rIS1m60gYBN3ccAQjrtZU2PjQzwanu.jpg',
      basePrice: 5000,
      effect: "Triples passive income",
      level: 1
    },
    { 
      id: 8,
      name: "Galactic WarpCrafts",
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Galactic%20WarpCrafts-Oq1vcLGks3AeFUz6M6ej1lBbo4eaqY.jpg',
      basePrice: 10000,
      effect: "Quadruples energy regeneration",
      level: 1
    },
  ])

  const [tasks, setTasks] = React.useState<Task[]>([
    { id: 1, description: 'Share on Facebook', reward: 500, progress: 0, completed: false, claimed: false, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Facebook%20icon-6GoJtap21nyoiQnYLSpB6IJtMTN02p.png" alt="Facebook" width={48} height={48} />, action: () => shareToSocialMedia('facebook') },
    { id: 2, description: 'Share on X', reward: 500, progress: 0, completed: false, claimed: false, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/X%203D%20icon-BKGCBNiG3sECcTXzWnsCIQKt2C7s2q.png" alt="X" width={48} height={48} />, action: () => shareToSocialMedia('x') },
    { id: 3, description: 'Share on Instagram', reward: 500, progress: 0, completed: false, claimed: false, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Instagram%203D%20icon-oGuCqwnySi2zDrS8HlS44YDNgGaCuH.png" alt="Instagram" width={48} height={48} />, action: () => shareToSocialMedia('instagram') },
    { id: 4, description: 'Subscribe to YouTube', reward: 2000, progress: 0, completed: false, claimed: false, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Youtube%203D%20icon-6rol1Ge421KShZTlo6utbgTE8fsxm8.png" alt="YouTube" width={48} height={48} />, action: () => openYouTubeChannel() },
    { id: 5, description: 'Watch YouTube videos', reward: 1500, progress: 0, maxProgress: 10, completed: false, claimed: false, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Youtube%203D%20icon-6rol1Ge421KShZTlo6utbgTE8fsxm8.png" alt="YouTube" width={48} height={48} />, action: () => watchYouTubeVideos() },
    { id: 6, description: 'Join TG News', reward: 1000, progress: 0, completed: false, claimed: false, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Telegram%203D%20icon-0mE8I8odV0mcJBqfO91vdaj6mxrgGS.png" alt="Telegram" width={48} height={48} />, action: () => joinTelegramChannel() },
    { id: 7, description: 'Invite 10 friends', reward: 2000, progress: 0, maxProgress: 10, completed: false, claimed: false, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Invite%203D%20icon-2VG1B7pHqsL5VeIjvBp0me4DZXRIKg.png" alt="Invite Friends" width={48} height={48} />, action: () => inviteFriends() },
    { id: 8, description: 'Reach level 10', reward: 1000000, progress: 0, maxProgress: 10, completed: false, claimed: false, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FIRE%203D%20ICON-2WjFYZbZ4SZ1BggDxdY0b4Zqxkk3lA.png" alt="Reach Level 10" width={48} height={48} />, action: () => {} },
    { id: 9, description: "Trophy's Level", reward: 100000, progress: 0, maxProgress: 10, completed: false, claimed: false, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Trophy%20Task%203D%20icon-TiL6cVCcwg5sxAGaMTNfFUmCFypzv1.png" alt="Trophy's Level" width={48} height={48} />, action: () => {} },
    { id: 10, description: "Follow X", reward: 1000, progress: 0, completed: false, claimed: false, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/X%203D%20icon-BKGCBNiG3sECcTXzWnsCIQKt2C7s2q.png" alt="X" width={48} height={48} />, action: () => followX() },
    { id: 11, description: "Follow Instagram", reward: 1000, progress: 0, completed: false, claimed: false, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Instagram%203D%20icon-oGuCqwnySi2zDrS8HlS44YDNgGaCuH.png" alt="Instagram" width={48} height={48} />, action: () => followInstagram() },
    { id: 12, description: "Follow WhatsApp", reward: 1000, progress: 0, completed: false, claimed: false, icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whatsapp%203D%20icon-zQ7YPZyXLWhIzlUUDOv03O3EE8qWSI.png" alt="WhatsApp" width={48} height={48} />, action: () => followWhatsApp() },
  ])

  const [leaderboard, setLeaderboard] = React.useState([])

  const level = useMemo(() => {
    const newLevel = levelRequirements.findIndex(req => user.coins < req)
    return newLevel === -1 ? levelRequirements.length : newLevel
  }, [user.coins])

  const nextLevelRequirement = useMemo(() => {
    if (level >= levelRequirements.length) return levelRequirements[levelRequirements.length - 1]
    return levelRequirements[level]
  }, [level])

  const generateDailyChallenge = React.useCallback(() => {
    const challenges = [
      { task: 'Click 1000 times', reward: 5000 },
      { task: 'Earn 10000 coins', reward: 2000 },
      { task: 'Buy 5 shop items', reward: 3000 },
      { task: 'Reach a new level', reward: 4000 },
    ];
    const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    setDailyChallenge({ ...randomChallenge, completed: false });
  }, [])

  const clickCoin = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (energy > 0) {
      setClickEffect(true)
      setTimeout(() => setClickEffect(false), 100)
      setUser(prevUser => {
        const clickValue = clickPower * multiplier

        const newCoins = prevUser.coins + clickValue
        const newExp = prevUser.exp + 1
        const newLevel = newExp >= 100 ? prevUser.level + 1 : prevUser.level

        // Add visual number show with animation
        const numberShow = document.createElement('div')
        numberShow.textContent = `+${formatNumber(clickValue)}`
        numberShow.style.position = 'absolute'
        numberShow.style.left = `${event.clientX}px`
        numberShow.style.top = `${event.clientY}px`
        numberShow.style.color = 'white'
        numberShow.style.fontSize = '24px'
        numberShow.style.fontWeight = 'bold'
        numberShow.style.pointerEvents = 'none'
        numberShow.style.transition = 'all 0.5s ease-out'
        document.body.appendChild(numberShow)

        setTimeout(() => {
          numberShow.style.transform = 'translateY(-50px) scale(1.5)'
          numberShow.style.opacity = '0'
        }, 50)

        setTimeout(() => {
          document.body.removeChild(numberShow)
        }, 500)

        return {
          ...prevUser,
          coins: newCoins,
          exp: newExp % 100,
          level: newLevel
        }
      })
      setEnergy(prev => Math.max(prev - 1, 0))

      // Trigger haptic feedback
      if (settings.vibration) {
        TelegramWebApp.hapticFeedback.impactOccurred('medium')
      }

      // Play sound effect
      if (settings.soundEffect) {
        playCoinSound()
      }

      // Send tap data to Telegram Mini App
      TelegramWebApp.sendData({ action: 'tap', amount: clickPower * multiplier })
    }
  }, [clickPower, energy, multiplier, settings])

  const buyItem = React.useCallback((item: any, isPremium = false) => {
    const price = isPremium ? item.basePrice * Math.pow(2, item.level - 1) : item.basePrice * Math.pow(2, item.level - 1)
    if (user.coins >= price) {
      setUser(prevUser => ({
        ...prevUser,
        coins: prevUser.coins - price
      }))
      if (isPremium) {
        setPremiumShopItems(prevItems => prevItems.map(i => {
          if (i.id === item.i d) {
            const newLevel = i.level + 1
            return { ...i, level: newLevel, basePrice: i.basePrice * 3 }
          }
          return i
        }))
        // Apply premium item effects
        switch (item.id) {
          case 6:
            setClickPower(prev => prev * 5)
            break
          case 7:
            setProfitPerHour(prev => prev * 3)
            break
          case 8:
            // Quadruple energy regeneration logic would go here
            break
        }
      } else {
        setShopItems(prevItems => prevItems.map(i => {
          if (i.id === item.id) {
            const newLevel = i.level + 1
            const newProfit = i.baseProfit * newLevel
            setProfitPerHour(prev => prev + newProfit - i.baseProfit * i.level)
            return { ...i, level: newLevel, basePrice: i.basePrice * 3 }
          }
          return i
        }))
      }

      setCongratulationPopup({ show: true, item: item })

      // Send purchase data to Telegram Mini App
      TelegramWebApp.sendData({ action: 'purchase', item: item.name, cost: price,  isPremium })
    } else {
      TelegramWebApp.showAlert('Not enough coins!')
    }
  }, [user.coins, setCongratulationPopup])

  const connectWallet = React.useCallback(async () => {
    try {
      // Simulated wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      TelegramWebApp.showAlert('Wallet connection simulation: Connected!')
      setWallet('0x1234...5678')
      // In a real implementation, this would involve interacting with a crypto wallet API
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      TelegramWebApp.showAlert('Failed to connect wallet. Please try again.');
    }
  }, [])

  const claimPPH = React.useCallback(() => {
    if (pphAccumulated > 0) {
      setUser(prevUser => ({
        ...prevUser,
        coins: prevUser.coins + pphAccumulated
      }))
      setPphAccumulated(0)
      setShowPPHPopup(false)
      setPphPopupShown(false)
      TelegramWebApp.showAlert(`Claimed ${formatNumber(pphAccumulated)} coins!`)
      // Send claim data to Telegram Mini App
      TelegramWebApp.sendData({ action: 'claim',  amount: pphAccumulated })
    } else {
      TelegramWebApp.showAlert('No profits to claim yet!')
    }
  }, [pphAccumulated])

  const claimNewLevel = React.useCallback(() => {
    TelegramWebApp.showAlert(`Congratulations! You've advanced to Level ${newLevel}!`)
    setUser(prevUser => ({
      ...prevUser,
      level: newLevel
    }))
    setUnlockedLevels(prev => [...prev, newLevel])
    setShowLevelUpPopup(false)
  }, [newLevel])

  const claimDailyReward = React.useCallback(() => {
    const now = new Date()
    const lastClaimed = dailyReward.lastClaimed ? new Date(dailyReward.lastClaimed) : null

    if (!dailyReward.completed && (!lastClaimed || now.getDate() !== lastClaimed.getDate() || now.getMonth() !== lastClaimed.getMonth() || now.getFullYear() !== lastClaimed.getFullYear())) {
      const newStreak = (lastClaimed && now.getDate() - lastClaimed.getDate() === 1) ? dailyReward.streak + 1 : 1
      const reward = getDailyReward(newStreak)

      setUser(prevUser => ({
        ...prevUser,
        coins: prevUser.coins + reward
      }))

      const newDay = (dailyReward.day % 30) + 1
      const completed = newDay === 1 // Reset completed flag when cycle completes

      setDailyReward(prev => ({
        lastClaimed: now.toISOString(),
        streak: newStreak,
        day: newDay,
        completed: completed
      }))

      TelegramWebApp.showAlert(`Claimed daily reward: ${formatNumber(reward)} coins! Streak: ${newStreak} days`)
    } else if (dailyReward.completed) {
      TelegramWebApp.showAlert('You have completed the 30-day reward cycle!')
    } else {
      TelegramWebApp.showAlert('You have already claimed your daily reward today!')
    }
  }, [dailyReward])

  const getDailyReward = (day: number) => {
    const rewards = [100, 250, 350, 650, 10000, 2500, 5000, 15000, 25000, 50000, 100000, 250000, 500000, 1000000, 2500000, 5000000]
    return rewards[day % rewards.length]
  }

  const activateMultiplier = React.useCallback(() => {
    if (!multiplierCooldown && !boosterCooldown) {
      setMultiplier(2)
      const endTime = Date.now() + 2 * 60 * 1000 // 2 minutes
      setMultiplierEndTime(endTime)
      TelegramWebApp.showAlert(`Activated 2x multiplier for 2 minutes!`)
      
      // Set up the cooldown after the multiplier ends
      const cooldownTimer = setTimeout(() => {
        setMultiplier(1)
        setMultiplierEndTime(null)
        setBoosterCooldown(Date.now() + 10 * 60 * 1000) // 10 minutes cooldown
        const unlockTimer = setTimeout(() => {
                    setBoosterCooldown(null)
                }, 10 * 60 * 1000)
        return () => clearTimeout(unlockTimer)
      }, 2 * 60 * 1000)
      
      return () => clearTimeout(cooldownTimer)
    } else if (boosterCooldown) {
      const remainingCooldown = Math.ceil((boosterCooldown - Date.now()) / 1000)
      TelegramWebApp.showAlert(`Booster on cooldown. Available in ${remainingCooldown} seconds.`)
    } else if (multiplierEndTime) {
      const remainingMultiplier = Math.ceil((multiplierEndTime - Date.now()) / 1000)
      TelegramWebApp.showAlert(`Multiplier active for ${remainingMultiplier} more seconds.`)
    }
  }, [multiplierCooldown, boosterCooldown, multiplierEndTime])

  const shareToSocialMedia = React.useCallback((platform: string) => {
    const message = "🏆 Just claimed some coins in Baby Cheetah! 🚀 Join me in this exciting crypto game and start earning too! 🤑 Complete tasks, invite friends, and rise in the ranks. Let's get those coins together! 💰🐾"
    if (platform === 'facebook') {
      TelegramWebApp.openLink(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`)
    } else if (platform === 'x') {
      TelegramWebApp.openLink(`https://x.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(window.location.href)}`)
    } else if (platform === 'instagram') {
      TelegramWebApp.openLink(`https://www.instagram.com/`)
      TelegramWebApp.showAlert('Copy and paste the message to your Instagram post!')
    } else if (platform === 'whatsapp') {
      TelegramWebApp.openLink(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`)
    }
    updateTaskProgress(platform === 'facebook' ? 1 : platform === 'x' ? 2 : platform === 'instagram' ? 3 : 12)
  }, [])

  const openYouTubeChannel = React.useCallback(() => {
    TelegramWebApp.openLink('https://www.youtube.com/channel/UC-pGiivNfXNXS3DQLblwisg')
    updateTaskProgress(4)
  }, [])

  const watchYouTubeVideos = React.useCallback(() => {
    TelegramWebApp.openLink('https://www.youtube.com/channel/UC-pGiivNfXNXS3DQLblwisg')
    updateTaskProgress(5)
  }, [])

  const joinTelegramChannel = React.useCallback(() => {
    TelegramWebApp.openTelegramLink('https://t.me/babycheetahcrypto')
    updateTaskProgress(6)
  }, [])

  const inviteFriends = React.useCallback(() => {
    TelegramWebApp.showConfirm(`Share your invite code: ${inviteCode}`, (confirmed) => {
      if (confirmed) {
        // Implement sharing functionality here
        updateTaskProgress(7)
      }
    })
  }, [inviteCode])

  const followX = React.useCallback(() => {
    TelegramWebApp.openLink('https://x.com/BabyCheetahTeam')
    updateTaskProgress(10)
  }, [])

  const followInstagram = React.useCallback(() => {
    TelegramWebApp.openLink('https://www.instagram.com/babycheetahcrypto/')
    updateTaskProgress(11)
  }, [])

  const followWhatsApp = React.useCallback(() => {
    TelegramWebApp.openLink('https://whatsapp.com/channel/0029VasnzUPAO7RJkehdu43p')
    updateTaskProgress(12)
  }, [])

  const updateTaskProgress = React.useCallback((taskId: number) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId && !task.completed) {
        const newProgress = task.progress + 1
        const completed = newProgress >= (task.maxProgress || 1)
        return { ...task, progress: newProgress, completed }
      }
      return task
    }))
  }, [])

  useEffect(() => {
    generateDailyChallenge();
  }, [generateDailyChallenge]);

  useEffect(() => {
    const initializeGame = async () => {
      setIsLoading(true)
      try {
        // Initialize user data from Telegram Web App
        const params = new URLSearchParams(TelegramWebApp.initData);
        const telegramId = params.get('user_id');
        const username = params.get('username');
        if (telegramId && username) {
          setUser(prevUser => ({
            ...prevUser,
            name: username,
            telegramId: telegramId,
          }));
        }

        // Fetch leaderboard data
        const leaderboardData = await fetchLeaderboard();
        setLeaderboard(leaderboardData);

        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call for all components
      } catch (error) {
        console.error('Failed to initialize game:', error);
        TelegramWebApp.showAlert('Failed to load game data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeGame();
    TelegramWebApp.ready();
    TelegramWebApp.expand();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Simulated global leaderboard data
      return [
        { id: 1, name: "CryptoKing", coins: 1000000, profitPerHour: 50000, rank: 1 },
        { id: 2, name: "ClickMaster", coins: 950000, profitPerHour: 48000, rank: 2 },
        { id: 3, name: "CoinCollector", coins: 900000, profitPerHour: 45000, rank: 3 },
        { id: 4, name: "TapChamp", coins: 850000, profitPerHour: 42000, rank: 4 },
        { id: 5, name: "CryptoNinja", coins: 800000, profitPerHour: 40000, rank: 5 },
      ];
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      return [];
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy(prevEnergy => {
        const newEnergy = Math.min(prevEnergy + 0.50, maxEnergy)
        if (energyRef.current) {
          energyRef.current.style.width = `${(newEnergy / maxEnergy) * 100}%`
        }
        return newEnergy
      })
      setPphAccumulated(prev => prev + profitPerHour / 3600)
    }, 1000)
    return () => clearInterval(timer)
  }, [maxEnergy, profitPerHour])

  useEffect(() => {
    if (!pphPopupShown) {
      setShowPPHPopup(true)
      setPphPopupShown(true)
    }
  }, [pphPopupShown])

  useEffect(() => {
    if (level > user.level) {
      setNewLevel(level)
      setShowLevelUpPopup(true)
    }
    // Update tasks progress for level-related tasks
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === 8) { // Reach level 10 task
        const newProgress = Math.min(level, 10)
        const completed = newProgress >= 10
        if (completed && !task.completed) {
          setUser(u => ({ ...u, coins: u.coins + task.reward }))
        }
        return { ...task, progress: newProgress, completed }
      }
      return task
    }))
  }, [level, user.level])


  const renderHeader = () => (
    <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-md p-2 rounded-full">
      <Card className="bg-transparent border-0 overflow-hidden">
        <CardContent className="p-2 flex items-center justify-between relative flex-wrap">
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center transform rotate-12 shadow-lg overflow-hidden">
              <Image
                src={user.profilePhoto}
                alt={user.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            </div>
            <div>
              <h2 className="font-bold text-lg text-white">{user.name}</h2>
              <div className="text-sm text-gray-400 flex items-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-aiTS1xss2vci240NAjWBlE8zVPfLov.png"
                  alt="Coin"
                  width={20}
                  height={20}
                  className="mr-1 animate-spin"
                />
                {formatNumber(user.coins)} coins
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-2 w-full justify-end">
            <Button
              variant="ghost"
              className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 backdrop-blur-md"
              onClick={() => {
                setCurrentPage('levels')
                playHeaderFooterSound()
              }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LEVEL%203D%20ICON-0VzQFGvjHWkPoGl5HmoDJ4edD4ZztE.png"
                alt="Levels"
                width={32}
                height={32}
              />
            </Button>
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 rounded-full shadow-lg flex items-center backdrop-blur-md">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CLOCK%203D%20ICON-eDq87xRT7SbQglWyWpe1keYbaDKbfM.png"
                alt="Profit Per Hour"
                width={24}
                height={24}
                className="mr-2"
              />
              <span className="text-sm font-bold text-white">{formatNumber(profitPerHour)}/h</span>
            </div>
            <Button
              variant="ghost"
              className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 backdrop-blur-md"
              onClick={() => {
                setCurrentPage('settings')
                playHeaderFooterSound()
              }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SETTING%203D%20ICON-Zln2aXS4iPIxlZfmYO42iPAKAwEtKt.png"
                alt="Settings"
                width={32}
                height={32}
              />
            </Button>
            <Button
              variant="ghost"
              className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 backdrop-blur-md"
              onClick={() => {
                setCurrentPage('trophies')
                playHeaderFooterSound()
              }}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TROPHY%203D%20ICON-r7DrilofLzG7BdFZtgONM1tDZHT5aO.png"
                alt="Trophies"
                width={32}
                height={32}
              />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderFooter = () => (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-md p-2 rounded-t-3xl"
      initial={{ y: 50 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around items-center max-w-md mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-900/50 rounded-full blur-xl"></div>
        {[
          { page: 'home', text: 'Home', icon: 'HOME%203D%20ICON-l0PT1uIGWdh36mELTwJwL4iX9QOqwY.png' },
          { page: 'shop', text: 'Shop', icon: 'SHOP%203D%20ICON-8W5KCBOOeijJzAMwkJlM3AvlopMlor.png' },
          { page: 'tasks', text: 'Tasks', icon: 'TASKS%203D%20ICON-xYtBLApGw0DH6Z96oMKZEnNZJu5KvW.png' },
          { page: 'rating', text: 'Rating', icon: 'RATING%203D%20ICON-445ZGZSdRbrUUyhr0TpzxlvsnwJNeu.png' },
          { page: 'wallet', text: 'Wallet', icon: 'WALLET%203D%20ICON-GQhzZExvdqTlDqxZLcBNZkfiaGpp53.png' },
          {  page: 'invite', text: 'Invite', icon: 'FRIEND%20INVITE%203D%20ICON-8lQ0eY4dY5Qznxnip4OH8ae53TzlvY.png' },
        ].map(({ page, text, icon }) => (
          <CryptoButton
            key={page}
            icon={(props) => (
              <Image
                src={`https://hebbkx1anhila5yf.public.blob.vercel-storage.com/${icon}`}
                alt={text}
                width={32}
                height={32}
                {...props}
              />
            )}
            href={page}
            text={text}
            isActive={currentPage === page}
            setCurrentPage={setCurrentPage}
          />
        ))}
      </div>
    </motion.div>
  )

  const renderHome = () => (
    <div className="flex-grow flex flex-col items-center justify-center p-4 relative">
      <motion.div
        className="text-center mb-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-7xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-indigo-400"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
        >
          {formatNumber(user.coins)}
        </motion.h1>
      </motion.div>
      {/* Removed Real Crypto Coin section as per update 1 */}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg"
        onClick={clickCoin}
      >
        <Image
          src={selectedCoinImage}
          alt={`Level ${user.level} Cheetah`}
          layout="fill"
          objectFit="contain"
          className="relative z-10"
        />
      </motion.button>

      <div className="w-full max-w-md space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2 text-gray-300">
            <span className="font-semibold">Energy</span>
            <span>{energy.toFixed(1)}/{maxEnergy}</span>
          </div>
          <motion.div
            className="h-3 bg-gray-700 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-gray-500 to-indigo-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(energy / maxEnergy) * 100}%` }}
              transition={{ duration: 0.5 }}
              ref={energyRef}
              style={{
                filter: "brightness(1.2)",
                boxShadow: "0 0 10px rgba(102, 126, 234, 0.5)"
              }}
            />
          </motion.div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-2 text-gray-300">
            <span className="font-semibold">Level {level}</span>
            <span>{formatNumber(user.coins)} / {formatNumber(nextLevelRequirement)} coins</span>
          </div>
          <motion.div
            className="h-3 bg-gray-700 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-gray-500 to-indigo-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(user.coins / nextLevelRequirement) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
      </div>

      <div className="mt-8 flex space-x-4">
        <Button
          onClick={() => {
            setCurrentPage('dailyReward')
            playHeaderFooterSound()
          }}
          className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 backdrop-blur-md"
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/GIFT%203D%20ICON-1N7HahK5oT1NZXElcGOdQiIVEt2fAR.png"
            alt="Daily Reward"
            width={24}
            height={24}
            className="mr-2"
          />
          <span>Daily Reward</span>
        </Button>
        <Button
          onClick={() => {
            activateMultiplier()
            playHeaderFooterSound()
          }}
          className={`bg-gradient-to-r ${boosterCooldown ? 'from-gray-600 to-gray-700' : 'from-gray-800 to-gray-900'} text-white px-4 py-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 backdrop-blur-md`}
          disabled={!!multiplierEndTime || !!boosterCooldown}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BOOST%203D%20ICON-dt9XRoqhHoghg1M8hOR1TJBLFPORVi.png"
            alt="2x Multiplier"
            width={24}
            height={24}
            className="mr-2"
          />
          <span>
            {boosterCooldown
              ? `Cooldown (${Math.ceil((boosterCooldown - Date.now()) / 1000)}s)`
              : multiplierEndTime
              ? `Active (${Math.ceil((multiplierEndTime - Date.now()) / 1000)}s)`
              : 'Booster'}
          </span>
        </Button>
      </div>
    </div>
  )

  const renderShop = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Premium Shop</h2>
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 gap-4">
          {shopItems.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NeonGradientCard className="bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                  <CardHeader className="relative p-4">
                    <CardTitle className="z-10 text-xl text-center">{item.name}</CardTitle>
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-30 transform skew-y-3"></div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <motion.div 
                      className="w-full h-40 mb-4 relative overflow-hidden rounded-lg"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        className="transform transition-transform duration-300 hover:scale-110"
                      />
                    </motion.div>
                    <p className="text-gray-300 mb-2">Level: {item.level}</p>
                    <p className="text-gray-300 mb-4">Profit: {formatNumber(item.baseProfit * item.level)}/h</p>
                    <Button
                      className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold py-3 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 hover:shadow-2xl"
                      onClick={() => {
                        buyItem(item)
                        playHeaderFooterSound()
                      }}
                    >
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      <span>Buy for {formatNumber(item.basePrice * Math.pow(2, item.level - 1))}</span>
                    </Button>
                  </CardContent>
                </NeonGradientCard>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <h2 className="text-2xl font-bold my-8 text-center text-white">Booster Shop</h2>
      <div className="grid grid-cols-1 gap-4">
        {premiumShopItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NeonGradientCard className="bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
              <CardHeader className="relative p-4">
                <CardTitle className="z-10 text-xl text-center">{item.name}</CardTitle>
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-30 transform -skew-y-3"></div>
              </CardHeader>
              <CardContent className="p-4">
                <motion.div 
                  className="w-full h-40 mb-4 relative overflow-hidden rounded-lg"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="transform transition-transform duration-300 hover:scale-110"
                  />
                </motion.div>
                <p className="text-gray-300 mb-2">Level: {item.level}</p>
                <p className="text-gray-300 mb-4">Effect: {item.effect}</p>
                <Button
                  className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold py-3 rounded-xl shadow-lg backdrop-blur-md transition-all duration-300 hover: shadow-2xl"
                  onClick={() => {
                    buyItem(item, true)
                    playHeaderFooterSound()
                  }}
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  <span>Buy for {formatNumber(item.basePrice * Math.pow(2, item.level - 1))}</span>
                </Button>
              </CardContent>
            </NeonGradientCard>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const renderTasks = () => (
    <div className="grid grid-cols-1 gap-6 p-6">
      {tasks.map((task) => (
        <motion.div
          key={task.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <NeonGradientCard className="bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="relative">
              <CardTitle className="flex items-center justify-between z-10 text-lg">
                <span className="flex items-center">
                  {task.icon}
                  <span className="ml-2">{task.description}</span>
                </span>
                <span className="text-gray-300 font-bold">{task.reward}  coins</span>
              </CardTitle>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-30 transform -skew-y-3"></div>
            </CardHeader>
            <CardContent>
              <motion.div
                className="h-3 bg-gray-700 rounded-full overflow-hidden mb-3"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-gray-500 to-indigo-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(task.progress / (task.maxProgress || 1)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{task.progress}/{task.maxProgress || 1} complete</span>
                {task.completed ? (
                  task.claimed ? (
                    <Button className="bg-green-600 text-white px-4 py-2 rounded-full" disabled>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span>Claimed</span>
                    </Button>
                  ) : (
                    <Button
                      className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-4 py-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 backdrop-blur-md"
                      onClick={() => {
                        setUser(prevUser => ({
                          ...prevUser,
                          coins: prevUser.coins + task.reward
                        }));
                        setTasks(prevTasks => prevTasks.map(t => 
                          t.id === task.id ? { ...t, claimed: true } : t
                        ));
                        TelegramWebApp.showAlert(`Claimed ${task.reward} coins!`);
                      }}
                    >
                      <Star className="w-5 h-5 mr-2" />
                      <span>Claim</span>
                    </Button>
                  )
                ) : (
                  <Button
                    className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-4 py-2 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 backdrop-blur-md"
                    onClick={() => {
                      task.action()
                      playHeaderFooterSound()
                    }}
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    <span>Go</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </NeonGradientCard>
        </motion.div>
      ))}
    </div>
  )

  const renderRating = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-start p-6 min-h-screen bg-gradient-to-b from-gray-900 to-black"
      >
        <motion.h2 
                    className="text-4xl font-bold text-white mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Leaderboard
        </motion.h2>
        <NeonGradientCard className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-4 gap-2 p-2 bg-gray-700 text-white font-bold text-xs">
            <div>Rank</div>
            <div>Player</div>
            <div>Coins</div>
            <div>Profit/h</div>
                      </div>
                                {leaderboardData.map((player, index) => (
              <motion.div
                key={player.id}
                className={`grid grid-cols-4 gap-2 p-2 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'} ${player.id === currentUserRank ? 'bg-indigo-900' : ''} text-xs`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex items-center text-white">{player.rank}</div>
                <div className="flex items-center text-white">
                  <Image
                    src={player.rank <= 3 
                      ? `https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PLAYER%20${player.rank}%203D%20ICON-${player.rank === 1 ? '3TrYn6NEWKVJFuSLX5T2WXkpSX0Osj' : player.rank === 2 ? 'NvCADY4SVeRcNr66NptlBivT6r5aqq' : 'mCCNFMTXDUSwKREiHMa2biybwjzLEp'}.png`
                      : 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PLAYER%203%203D%20ICON-mCCNFMTXDUSwKREiHMa2biybwjzLEp.png'
                    }
                    alt={`Player ${player.rank} Icon`}
                    width={24}
                    height={24}
                    className="mr-2"
                  />
                  {player.name}
                </div>
                <div className="flex items-center text-white">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-bevDcFdg5tHGB7OCgU7jJuMK62gOkX.png"
                    alt="Coin Logo"
                    width={16}
                    height={16}
                    className="mr-2"
                  />
                  <motion.span
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  >
                    {formatNumber(player.coins)}
                  </motion.span>
                </div>
                <div className="flex items-center text-white">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatNumber(player.profitPerHour)}/h
                </div>
              </motion.div>
            ))}
        
        </NeonGradientCard>
        {currentUserRank > 0 && (
          <motion.div
            className="mt-8 p-4 bg-indigo-900 rounded-lg shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-white text-xl">Your current rank: {currentUserRank}</p>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const renderWallet = () => (
    <div className="flex-grow flex items-center justify-center p-6">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <NeonGradientCard className="bg-gradient-to-br from-gray-900 to-black text-white w-full max-w-md overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="relative">
            <CardTitle className="z-10 text-2xl flex items-center">
              Airdrop Soon!
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Airdrop%203D%20icon-IH750zXIMPEENVMc6NcJbWLwCif9xJ.png"
                alt="Airdrop"
                width={96}
                height={96}
                className="ml-2 animate-pulse"
              />
            </CardTitle>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-30 transform -skew-y-3"></div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {wallet ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
                  <span className="text-green-400 flex items-center text-lg">
                    <CheckCircle className="mr-2 w-6 h-6" /> Connected
                  </span>
                  <span className="text-sm bg-gray-700 px-3 py-1 rounded-full text-white">{wallet}</span>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => {
                  connectWallet()
                  playHeaderFooterSound()
                }}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white py-4 rounded-xl text-xl font-bold transform transition-all duration-200 hover:scale-105 backdrop-blur-md flex items-center justify-center"
              >
                <Wallet className="w-6 h-6 mr-2" />
                <span>Connect Wallet</span>
              </Button>
            )}
          </CardContent>
        </NeonGradientCard>
      </motion.div>
    </div>
  )

  const renderLevels = () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      {levelImages.map((image, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NeonGradientCard className={`bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden transform transition-all duration-300 hover:shadow-2xl ${unlockedLevels.includes(index + 1) ? 'border-2 border-indigo-400' : ''}`}>
            <CardHeader className="relative">
              <CardTitle className="z-10 text-center text-sm">Level {index + 1}</CardTitle>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-30 transform skew-y-3"></div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95, rotate: -5 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                className="relative w-20 h-20 rounded-full overflow-hidden shadow-lg"
                onClick={() => {
                  setSelectedCoinImage(image)
                  setCurrentPage('home')
                  playHeaderFooterSound()
                }}
                disabled={!unlockedLevels.includes(index + 1)}
              >
                <Image
                  src={image}
                  alt={`Level ${index + 1}`}
                  layout="fill"
                  objectFit="contain"
                  className={`relative z-10 ${!unlockedLevels.includes(index + 1) ? 'opacity-50 grayscale' : ''}`}
                />
              </motion.button>
              <p className="text-xs text-center text-gray-300">Unlock at {formatNumber(levelRequirements[index])} coins</p>
            </CardContent>
          </NeonGradientCard>
        </motion.div>
      ))}
    </div>
  )

  const renderSettings = () => (
    <div className="flex-grow flex items-center justify-center p-6">
      <NeonGradientCard className="bg-gradient-to-br from-gray-900 to-black text-white w-96 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="relative">
          <CardTitle className="z-10 text-2xl">Settings</CardTitle>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-30 transform -skew-y-3"></div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="vibration">Vibration</Label>
            <Switch
              id="vibration"
              checked={settings.vibration}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, vibration: checked }))}
              className="bg-gray-600 data-[state=checked]:bg-gray-800"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="background-music">Background Music</Label>
            <Switch
              id="background-music"
              checked={settings.backgroundMusic}
              onCheckedChange={(checked)  =>  setSettings(prev => ({ ...prev, backgroundMusic: checked }))}
              className="bg-gray-600 data-[state=checked]:bg-gray-800"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="sound-effect">Sound Effect</Label>
            <Switch
              id="sound-effect"
              checked={settings.soundEffect}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, soundEffect: checked }))}
              className="bg-gray-600 data-[state=checked]:bg-gray-800"
            />
          </div>
        </CardContent>
      </NeonGradientCard>
    </div>
  )

  const renderDailyReward = () => (
    <div className="flex-grow flex flex-col items-center justify-center p-6">
      <NeonGradientCard className="bg-gradient-to-br from-gray-900 to-black text-white w-full max-w-2xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="relative">
          <CardTitle className="z-10 text-3xl text-center">Daily Rewards</CardTitle>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-30 transform -skew-y-3"></div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 30 }, (_, i) => {
              const day = i + 1;
              const isCurrentDay = day === dailyReward.day;
              const isPastDay = day < dailyReward.day;
              const isFutureDay = day > dailyReward.day;
              const reward = getDailyReward(day);

              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg flex flex-col items-center justify-center relative overflow-hidden ${
                    isCurrentDay ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-800 to-gray-900'
                  }`}
                >
                  <span className="text-sm font-bold mb-1">{day}</span>
                  <Gift className={`w-6 h-6 ${
                    isCurrentDay
                      ? 'text-white'
                      : isPastDay
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`} />
                  <div className="mt-1 text-xs font-semibold">
                    {formatNumber(reward)}
                  </div>
                  {isPastDay && (
                    <CheckCircle className="absolute top-1 right-1 w-4 h-4 text-green-400" />
                  )}
                </motion.div>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <p className="text-xl mb-4">Current Streak: {dailyReward.streak} days</p>
            <Button
              onClick={() => {
                claimDailyReward()
                playHeaderFooterSound()
              }}
              className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 backdrop-blur-md"
              disabled={dailyReward.completed}
            >
              <Gift className="w-6 h-6 mr-2"/>
              Claim Reward
            </Button>
          </div>
        </CardContent>
      </NeonGradientCard>
    </div>
  )

  const renderInvite = () => (
    <div className="flex-grow flex items-center justify-center p-6">
      <NeonGradientCard className="bg-gradient-to-br from-gray-900 to-black text-white w-full max-w-md overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="relative">
          <CardTitle className="z-10 text-3xl text-center">Invite Friends</CardTitle>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-30 transform -skew-y-3"></div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <p className="text-sm mb-2">Share via:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: 'Youtube', icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Youtube%203D%20icon-6rol1Ge421KShZTlo6utbgTE8fsxm8.png" alt="YouTube" width={40} height={40} /> },
                { name: 'X', icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/X%203D%20icon-BKGCBNiG3sECcTXzWnsCIQKt2C7s2q.png" alt="X" width={40} height={40} /> },
                { name: 'Facebook', icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Facebook%20icon-6GoJtap21nyoiQnYLSpB6IJtMTN02p.png" alt="Facebook" width={40} height={40} /> },
                { name: 'Instagram', icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Instagram%203D%20icon-oGuCqwnySi2zDrS8HlS44YDNgGaCuH.png" alt="Instagram" width={40} height={40} /> },
                { name: 'Telegram', icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Telegram%203D%20icon-0mE8I8odV0mcJBqfO91vdaj6mxrgGS.png" alt="Telegram" width={40} height={40} /> },
                { name: 'WhatsApp', icon: <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Whatsapp%203D%20icon-zQ7YPZyXLWhIzlUUDOv03O3EE8qWSI.png" alt="WhatsApp" width={40} height={40} /> }
              ].map((platform) => (
                <motion.div
                  key={platform.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white px-6 py-4 rounded-full transform transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 backdrop-blur-md"
                    onClick={() => {
                      shareToSocialMedia(platform.name.toLowerCase())
                      playHeaderFooterSound()
                    }}
                  >
                    {platform.icon}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm mb-2">Rewards:</p>
            <ul className="list-disc list-inside text-left text-gray-300">
              <li>1,000 coins for each friend who joins</li>
            </ul>
          </div>
          <Button
            onClick={() => setCurrentPage('friendsActivity')}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white py-3 rounded-full text-lg font-bold transform transition-all duration-300 hover:scale-105 backdrop-blur-md mt-4 flex items-center justify-center"
          >
            Friends Activity
          </Button>
        </CardContent>
      </NeonGradientCard>
    </div>
  )

  const renderFriendsActivity = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-grow flex items-center justify-center p-6"
    >
      <NeonGradientCard className="bg-gradient-to-br from-gray-900 to-black text-white w-full max-w-md overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="relative">
          <CardTitle className="z-10 text-3xl text-center">Friends Activity</CardTitle>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-30 transform -skew-y-3"></div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {Object.entries(friendsCoins).map(([friend, coins], index) => (
            <motion.div
              key={friend}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex justify-between items-center bg-gray-700 bg-opacity-50 p-4 rounded-lg backdrop-blur-md"
            >
              <span className="font-bold">{friend}</span>
              <span>{formatNumber(coins)} coins</span>
            </motion.div>
          ))}
          {Object.keys(friendsCoins).length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-gray-400"
            >
              No friend activity yet. Invite some friends to get started!
            </motion.p>
          )}
        </CardContent>
      </NeonGradientCard>
    </motion.div>
  )

  const renderTrophies = () => (
    <div className="grid grid-cols-1 gap-4 p-4">
      {trophies.map((trophy, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <NeonGradientCard className={`bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden transform transition-all duration-300 hover:shadow-2xl ${user.coins >= trophy.requirement ? 'border-2 border-indigo-400' : ''}`}>
            <CardHeader className="relative">
              <CardTitle className="z-10 text-center">{trophy.name}</CardTitle>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-30 transform skew-y-3"></div>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-4">
              <div className="w-24 h-24 mb-4 relative flex items-center justify-center">
                {trophy.icon}
              </div>
              <p className="text-sm text-center text-gray-300">{trophy.description}</p>
              <p className="text-sm text-center text-gray-300 mt-2">Requirement: {formatNumber(trophy.requirement)} coins</p>
              <p className="text-sm text-center text-gray-300">Prize: {formatNumber(trophy.prize)} coins</p>
              {user.coins >= trophy.requirement ? (
                <Button
                  className="mt-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white py-2 px-4 rounded-full text-xs font-bold transform transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 backdrop-blur-md"
                  onClick={() => {
                    setUser(prev => ({ ...prev, coins: prev.coins + trophy.prize }))
                    TelegramWebApp.showAlert(`Congratulations! You've claimed the ${trophy.name} trophy and earned ${formatNumber(trophy.prize)} coins!`)
                    playHeaderFooterSound()
                  }}
                >
                  <Image src="/claim-icon.svg" alt="Claim Prize" width={16} height={16} className="mr-2"/>
                  Claim
                </Button>
              ) : (
                <div className="mt-4 bg-gray-600 text-white py-2 px-4 rounded-full text-xs font-bold">
                  Locked
                </div>
              )}
            </CardContent>
          </NeonGradientCard>
        </motion.div>
      ))}
    </div>
  )


  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
  }

  const [currentUserRank, setCurrentUserRank] = React.useState(0);
  const [leaderboardData, setLeaderboardData] = React.useState([]);

  React.useEffect(() => {
    const fetchLeaderboardData = async () => {
      const data = await fetchLeaderboard();
      setLeaderboardData(data);
      setCurrentUserRank(Math.floor(Math.random() * 200) + 1);
    };
    fetchLeaderboardData();
  }, []);


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-black opacity-50"></div>
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  animation: `twinkle ${Math.random() * 5 + 3}s infinite`,
                }}
              ></div>
            ))}
          </div>
        </div>
        <motion.div
          className="text-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-iTiljsrx8N2IGIdjozA2tXBHhaCi8x.png"
            alt="Logo"
            width={100}
            height={100}
            className="mx-auto mb-8"
          />
          <motion.div
            className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const Popup = ({ title, children, onClose }: {title: string, children: React.ReactNode, onClose: () => void}) => (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-2xl shadow-2xl z-10 max-w-md w-full mx-4">
        <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>
        {children}
      </div>
    </div>
  );

  const CongratulationPopup = () => (
    <Popup title="Congratulations!" onClose={() => setCongratulationPopup({ show: false, item: null })}>
      <p className="mb-6 text-xl text-center">
        You've purchased <span className="text-yellow-400 font-bold">{congratulationPopup.item?.name}</span>!
      </p>
      <Button 
        onClick={() => setCongratulationPopup({ show: false, item: null })}
        className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-800 text-white text-xl py-4 rounded-full shadow-lg"
      >
        <Star className="w-6 h-6 mr-2" />
        <span>Awesome!</span>
      </Button>
    </Popup>
  );

  return (
    <React.Fragment>
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden max-w-md mx-auto px-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-95"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-black opacity-50"></div>
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animation: `twinkle ${Math.random() * 5 + 3}s infinite`,
              }}
            ></div>
          ))}
        </div>
      </div>
      {renderHeader()}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-grow overflow-auto pb-24"
        >
          {currentPage === 'home' && renderHome()}
          {currentPage === 'shop' && renderShop()}
          {currentPage === 'tasks' && renderTasks()}
          {currentPage === 'rating' && renderRating()}
          {currentPage === 'wallet' && renderWallet()}
          {currentPage === 'levels' && renderLevels()}
          {currentPage === 'settings' && renderSettings()}
          {currentPage === 'dailyReward' && renderDailyReward()}
          {currentPage === 'invite' && renderInvite()}
          {currentPage === 'friendsActivity' && renderFriendsActivity()}
          {currentPage === 'trophies' && renderTrophies()}
        </motion.div>
      </AnimatePresence>
      {renderFooter()}
      <AnimatePresence>
        {congratulationPopup.show && <CongratulationPopup />}
        {showLevelUpPopup && (
          <Popup title="Level Up!" onClose={claimNewLevel}>
            <p className="text-xl mb-6">You've reached Level {newLevel}!</p>
            <div className="w-40 h-40 mx-auto mb-6 relative">
              <Image
                src={levelImages[newLevel - 1]}
                alt={`Level ${newLevel}`}
                layout="fill"
                objectFit="contain"
                className="rounded-full"
              />
            </div>
            <p className="text-lg mb-6">Unlock the new level and boost your clicking power!</p>
            <Button onClick={() => {
              claimNewLevel()
              playHeaderFooterSound()
            }}
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white text-xl py-3 transform transition-all duration-300 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 backdrop-blur-md">
              <Star className="w-6 h-6 mr-2" />
              <span>Claim New Level</span>
            </Button>
          </Popup>
        )}
      </AnimatePresence>
      {settings.backgroundMusic && (
        <audio
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Riches%20in%20the%20Shadows-2LMh4YhG2ic8UlvtdAjMtD1UHrac8y.MP3"
          autoPlay
          loop
          className="hidden"
        />
      )}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes coinAnimation {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
    </React.Fragment>
  );
}