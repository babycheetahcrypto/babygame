import * as React from 'react'
import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Users, ShoppingBag, Wallet, Star, Home, CheckCircle, Clock, Settings, Gift, Zap, Award, Layers, Trophy, UserPlus, Volume2, VolumeX, Calendar, Lock, Unlock, Facebook, Twitter, Instagram, Youtube, Send, Coins, Medal, Crown, Code, Anchor, Globe, ArrowRight, Copy } from 'lucide-react'
import Image from 'next/image'

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
  const [coins, setCoins] = useState(0)
  const [coinsPerClick, setCoinsPerClick] = useState(1)
  const [coinsPerSecond, setCoinsPerSecond] = useState(0)
  const [currentPage, setCurrentPage] = useState('home')
  const [level, setLevel] = useState(1)
  const [shopItems, setShopItems] = useState<ShopItem[]>([
    { id: 1, name: "Mining Rig", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mining%20Rig-Hy5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue.png", basePrice: 10, baseProfit: 0.1, level: 0 },
    { id: 2, name: "Crypto Farm", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Crypto%20Farm-5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.png", basePrice: 100, baseProfit: 1, level: 0 },
    { id: 3, name: "Quantum Computer", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Quantum%20Computer-e5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue.png", basePrice:  1000, baseProfit: 10, level: 0 },
    { id: 4, name: "AI Trading Bot", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/AI%20Trading%20Bot-5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5.png", basePrice: 10000, baseProfit: 100, level: 0 },
    { id: 5, name: "Blockchain Network", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Blockchain%20Network-Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.png", basePrice: 100000, baseProfit: 1000, level: 0 },
  ])
  const [premiumShopItems, setPremiumShopItems] = useState<PremiumShopItem[]>([
    { id: 1, name: "Golden Cheetah", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Golden%20Cheetah-e5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue.png", basePrice: 1000, effect: "2x Coin Production", level: 0 },
    { id: 2, name: "Time Warp", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Time%20Warp-5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.png", basePrice: 5000, effect: "1 Hour of Production", level: 0 },
    { id: 3, name: "Crypto Sage", image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Crypto%20Sage-Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5Ue5U.png", basePrice: 10000, effect: "3x Click Power", level: 0 },
  ])
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, description: "Click 100 times", reward: 1000, progress: 0, maxProgress: 100, completed: false, claimed: false, icon: <Zap className="w-6 h-6" />, action: () => {} },
    { id: 2, description: "Buy 5 items from the shop", reward: 5000, progress: 0, maxProgress: 5, completed: false, claimed: false, icon: <ShoppingBag className="w-6 h-6" />, action: () => {} },
    { id: 3, description: "Reach 1,000,000 coins", reward: 10000, progress: 0, maxProgress: 1000000, completed: false, claimed: false, icon: <Coins className="w-6 h-6" />, action: () => {} },
  ])
  const [dailyReward, setDailyReward] = useState({ amount: 1000, claimed: false })
  const [leaderboard, setLeaderboard] = useState([
    { name: "CryptoKing", score: 1000000 },
    { name: "BlockchainQueen", score: 750000 },
    { name: "SatoshiDisciple", score: 500000 },
    { name: "HODLer4Life", score: 250000 },
    { name: "AltcoinGuru", score: 100000 },
  ])
  const [settings, setSettings] = useState({
    sound: true,
    notifications: true,
    darkMode: false,
  })
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedUpgrade, setSelectedUpgrade] = useState<ShopItem | null>(null)
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [selectedPremiumItem, setSelectedPremiumItem] = useState<PremiumShopItem | null>(null)
  const [showRewardModal, setShowRewardModal] = useState(false)
  const [rewardModalContent, setRewardModalContent] = useState({ title: '', message: '' })
  const [showShareModal, setShowShareModal] = useState(false)
  const [achievements, setAchievements] = useState<{ name: string; completed: boolean }[]>([
    { name: "First Click", completed: false },
    { name: "Shopaholic", completed: false },
    { name: "Millionaire", completed: false },
    { name: "Task Master", completed: false },
    { name: "Premium Player", completed: false },
  ])

  const earnCoins = useCallback(() => {
    setCoins(prevCoins => {
      const newCoins = prevCoins + coinsPerClick
      updateLevel(newCoins)
      updateTasks(1, 1)
      updateTasks(3, newCoins)
      checkAchievements(newCoins)
      return newCoins
    })
    playCoinSound()
    TelegramWebApp.hapticFeedback.impactOccurred('light')
  }, [coinsPerClick])

  const updateLevel = useCallback((newCoins: number) => {
    const newLevel = levelRequirements.findIndex(req => newCoins < req)
    if (newLevel !== -1 && newLevel !== level) {
      setLevel(newLevel)
      setShowRewardModal(true)
      setRewardModalContent({
        title: 'Level Up!',
        message: `Congratulations! You've reached level ${newLevel}!`
      })
    }
  }, [level])

  const updateTasks = useCallback((taskId: number, progress: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId
          ? { 
              ...task, 
              progress: Math.min(task.progress + progress, task.maxProgress || Infinity),
              completed: task.progress + progress >= (task.maxProgress || Infinity)
            }
          : task
      )
    )
  }, [])

  const checkAchievements = useCallback((newCoins: number) => {
    setAchievements(prevAchievements => 
      prevAchievements.map(achievement => {
        if (achievement.name === "First Click" && !achievement.completed) {
          return { ...achievement, completed: true }
        }
        if (achievement.name === "Millionaire" && newCoins >= 1000000 && !achievement.completed) {
          return { ...achievement, completed: true }
        }
        return achievement
      })
    )
  }, [])

  const buyShopItem = useCallback((item: ShopItem) => {
    const cost = Math.floor(item.basePrice * Math.pow(1.15, item.level))
    if (coins >= cost) {
      setCoins(prevCoins => prevCoins - cost)
      setShopItems(prevItems => 
        prevItems.map(i => 
          i.id === item.id 
            ? { ...i, level: i.level + 1 }
            : i
        )
      )
      setCoinsPerSecond(prevCPS => prevCPS + item.baseProfit)
      updateTasks(2, 1)
      checkAchievements(coins - cost)
    } else {
      TelegramWebApp.showAlert("Not enough coins!")
    }
  }, [coins])

  const buyPremiumItem = useCallback((item: PremiumShopItem) => {
    const cost = item.basePrice * (item.level + 1)
    if (coins >= cost) {
      setCoins(prevCoins => prevCoins - cost)
      setPremiumShopItems(prevItems => 
        prevItems.map(i => 
          i.id === item.id 
            ? { ...i, level: i.level + 1 }
            : i
        )
      )
      // Apply premium item effects
      if (item.name === "Golden Cheetah") {
        setCoinsPerSecond(prevCPS => prevCPS * 2)
      } else if (item.name === "Time Warp") {
        setCoins(prevCoins => prevCoins + coinsPerSecond * 3600)
      } else if (item.name === "Crypto Sage") {
        setCoinsPerClick(prevCPC => prevCPC * 3)
      }
      checkAchievements(coins - cost)
    } else {
      TelegramWebApp.showAlert("Not enough coins!")
    }
  }, [coins, coinsPerSecond])

  const claimDailyReward = useCallback(() => {
    if (!dailyReward.claimed) {
      setCoins(prevCoins => prevCoins + dailyReward.amount)
      setDailyReward(prevReward => ({ ...prevReward, claimed: true }))
      setShowRewardModal(true)
      setRewardModalContent({
        title: 'Daily Reward',
        message: `You've claimed your daily reward of ${dailyReward.amount} coins!`
      })
    }
  }, [dailyReward])

  const claimTaskReward = useCallback((taskId: number) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId && task.completed && !task.claimed
          ? { ...task, claimed: true }
          : task
      )
    )
    setCoins(prevCoins => {
      const task = tasks.find(t => t.id === taskId)
      return prevCoins + (task?.reward || 0)
    })
    checkAchievements(coins)
  }, [tasks, coins])

  const toggleSetting = useCallback((setting: 'sound' | 'notifications' | 'darkMode') => {
    setSettings(prevSettings => ({ ...prevSettings, [setting]: !prevSettings[setting] }))
  }, [])

  const shareProgress = useCallback(() => {
    const shareMessage = `I've reached level ${level} in Baby Cheetah! Join me in this crypto adventure!`
    // In a real app, this would open a native share dialog
    console.log("Sharing:", shareMessage)
    setShowShareModal(true)
  }, [level])

  useEffect(() => {
    const timer = setInterval(() => {
      setCoins(prevCoins => {
        const newCoins = prevCoins + coinsPerSecond
        updateLevel(newCoins)
        updateTasks(3, newCoins)
        checkAchievements(newCoins)
        return newCoins
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [coinsPerSecond, updateLevel, updateTasks, checkAchievements])

  useEffect(() => {
    // This effect runs once when the component mounts
    TelegramWebApp.ready()
    TelegramWebApp.expand()

    // Set up event listeners
    TelegramWebApp.onEvent('viewportChanged', () => {
      // Handle viewport changes
    })

    // Clean up
    return () => {
      // Remove event listeners if necessary
    }
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Image src={levelImages[level - 1]} alt={`Level ${level} Cheetah`} width={40} height={40} className="mr-2" />
          <span className="text-xl font-bold">Level {level}</span>
        </div>
        <div className="flex items-center">
          <Coins className="w-6 h-6 mr-1 text-yellow-400" />
          <span className="text-xl font-bold">{formatNumber(coins)}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-auto p-4">
        {currentPage === 'home' && (
          <div className="flex flex-col items-center">
            <NeonGradientCard className="w-full max-w-md mb-4">
              <motion.button
                className="w-full h-48 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg flex items-center justify-center text-4xl font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={earnCoins}
              >
                Click Me!
              </motion.button>
            </NeonGradientCard>
            <div className="text-center mb-4">
              <p className="text-lg">Coins per click: {formatNumber(coinsPerClick)}</p>
              <p className="text-lg">Coins per second: {formatNumber(coinsPerSecond)}</p>
            </div>
            <Button onClick={claimDailyReward} disabled={dailyReward.claimed} className="mb-4">
              {dailyReward.claimed ? 'Daily Reward Claimed' : 'Claim Daily Reward'}
            </Button>
          </div>
        )}

        {currentPage === 'shop' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Shop</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shopItems.map(item => (
                <NeonGradientCard key={item.id} className="p-4">
                  <div className="flex items-center mb-2">
                    <Image src={item.image} alt={item.name} width={50} height={50} className="mr-2" />
                    <div>
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p>Level: {item.level}</p>
                    </div>
                  </div>
                  <p>Cost: {formatNumber(Math.floor(item.basePrice * Math.pow(1.15, item.level)))} coins</p>
                  <p>Profit: {formatNumber(item.baseProfit * (item.level + 1))} coins/s</p>
                  <Button onClick={() => {
                    setSelectedUpgrade(item)
                    setShowUpgradeModal(true)
                  }} className="mt-2">
                    Upgrade
                  </Button>
                </NeonGradientCard>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'tasks' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Tasks</h2>
            <div className="space-y-4">
              {tasks.map(task => (
                <NeonGradientCard key={task.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {task.icon}
                      <div className="ml-2">
                        <h3 className="text-lg font-bold">{task.description}</h3>
                        <p>Reward: {formatNumber(task.reward)} coins</p>
                      </div>
                    </div>
                    {task.completed ? (
                      task.claimed ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : (
                        <Button onClick={() => claimTaskReward(task.id)}>Claim</Button>
                      )
                    ) : (
                      <p>{formatNumber(task.progress)} / {formatNumber(task.maxProgress || 0)}</p>
                    )}
                  </div>
                </NeonGradientCard>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'leaderboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
            <div className="space-y-4">
              {leaderboard.map((player, index) => (
                <NeonGradientCard key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {index === 0 && <Crown className="w-6 h-6 text-yellow-400 mr-2" />}
                      {index === 1 && <Medal className="w-6 h-6 text-gray-400 mr-2" />}
                      {index === 2 && <Award className="w-6 h-6 text-orange-400 mr-2" />}
                      <span className="text-lg font-bold">{player.name}</span>
                    </div>
                    <span>{formatNumber(player.score)} coins</span>
                  </div>
                </NeonGradientCard>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'premium' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Premium Shop</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {premiumShopItems.map(item => (
                <NeonGradientCard key={item.id} className="p-4">
                  <div className="flex items-center mb-2">
                    <Image src={item.image} alt={item.name} width={50} height={50} className="mr-2" />
                    <div>
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <p>Level: {item.level}</p>
                    </div>
                  </div>
                  <p>Cost: {formatNumber(item.basePrice * (item.level + 1))} coins</p>
                  <p>Effect: {item.effect}</p>
                  <Button onClick={() => {
                    setSelectedPremiumItem(item)
                    setShowPremiumModal(true)
                  }} className="mt-2">
                    Purchase
                  </Button>
                </NeonGradientCard>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'achievements' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Achievements</h2>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <NeonGradientCard key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{achievement.name}</span>
                    {achievement.completed ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : (
                      <Lock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </NeonGradientCard>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Sound</span>
                <Switch
                  checked={settings.sound}
                  onCheckedChange={() => toggleSetting('sound')}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Notifications</span>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={() => toggleSetting('notifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Dark Mode</span>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={() => toggleSetting('darkMode')}
                />
              </div>
              <Button onClick={shareProgress} className="w-full">
                Share Progress
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Navigation */}
      <footer className="bg-gray-800 p-4">
        <div className="flex justify-around">
          <CryptoButton icon={Home} href="home" text="Home" isActive={currentPage === 'home'} setCurrentPage={setCurrentPage} />
          <CryptoButton icon={ShoppingBag} href="shop" text="Shop" isActive={currentPage === 'shop'} setCurrentPage={setCurrentPage} />
          <CryptoButton icon={CheckCircle} href="tasks" text="Tasks" isActive={currentPage === 'tasks'} setCurrentPage={setCurrentPage} />
          <CryptoButton icon={Users} href="leaderboard" text="Leaderboard" isActive={currentPage === 'leaderboard'} setCurrentPage={setCurrentPage} />
          <CryptoButton icon={Star} href="premium" text="Premium" isActive={currentPage === 'premium'} setCurrentPage={setCurrentPage} />
          <CryptoButton icon={Trophy} href="achievements" text="Achievements" isActive={currentPage === 'achievements'} setCurrentPage={setCurrentPage} />
          <CryptoButton icon={Settings} href="settings" text="Settings" isActive={currentPage === 'settings'} setCurrentPage={setCurrentPage} />
        </div>
      </footer>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && selectedUpgrade && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <NeonGradientCard className="w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Upgrade {selectedUpgrade.name}</h2>
              <p>Current Level: {selectedUpgrade.level}</p>
              <p>Cost: {formatNumber(Math.floor(selectedUpgrade.basePrice * Math.pow(1.15, selectedUpgrade.level)))} coins</p>
              <p>New Profit: {formatNumber(selectedUpgrade.baseProfit * (selectedUpgrade.level + 2))} coins/s</p>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setShowUpgradeModal(false)} variant="ghost" className="mr-2">
                  Cancel
                </Button>
                <Button onClick={() => {
                  buyShopItem(selectedUpgrade)
                  setShowUpgradeModal(false)
                }}>
                  Upgrade
                </Button>
              </div>
            </NeonGradientCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Item Modal */}
      <AnimatePresence>
        {showPremiumModal && selectedPremiumItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <NeonGradientCard className="w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Purchase {selectedPremiumItem.name}</h2>
              <p>Current Level: {selectedPremiumItem.level}</p>
              <p>Cost: {formatNumber(selectedPremiumItem.basePrice * (selectedPremiumItem.level + 1))} coins</p>
              <p>Effect: {selectedPremiumItem.effect}</p>
              <div className="flex justify-end mt-4">
                <Button onClick={() => setShowPremiumModal(false)} variant="ghost" className="mr-2">
                  Cancel
                </Button>
                <Button onClick={() => {
                  buyPremiumItem(selectedPremiumItem)
                  setShowPremiumModal(false)
                }}>
                  Purchase
                </Button>
              </div>
            </NeonGradientCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reward Modal */}
      <AnimatePresence>
        {showRewardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <NeonGradientCard className="w-full max-w-md text-center">
              <h2 className="text-2xl font-bold mb-4">{rewardModalContent.title}</h2>
              <p>{rewardModalContent.message}</p>
              <Button onClick={() => setShowRewardModal(false)} className="mt-4">
                Claim
              </Button>
            </NeonGradientCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <NeonGradientCard className="w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">Share Your Progress</h2>
              <p className="mb-4">Share your amazing progress with friends!</p>
              <div className="flex justify-center space-x-4">
                <Button onClick={() => {
                  // Implement Facebook sharing
                  setShowShareModal(false)
                }}>
                  <Facebook className="w-6 h-6" />
                </Button>
                <Button onClick={() => {
                  // Implement Twitter sharing
                  setShowShareModal(false)
                }}>
                  <Twitter className="w-6 h-6" />
                </Button>
                <Button onClick={() => {
                  // Implement Telegram sharing
                  setShowShareModal(false)
                }}>
                  <Send className="w-6 h-6" />
                </Button>
              </div>
              <Button onClick={() => setShowShareModal(false)} variant="ghost" className="mt-4">
                Close
              </Button>
            </NeonGradientCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
