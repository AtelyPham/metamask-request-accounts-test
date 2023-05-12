'use client'

import detectEthereumProvider from '@metamask/detect-provider'
import { useState } from 'react'

type RequestArguments = {
  method: string
  params?: unknown[] | Record<string, unknown>
}

interface MetaMaskEthereumProvider {
  isMetaMask?: boolean
  once(eventName: string | symbol, listener: (...args: any[]) => void): this
  on(eventName: string | symbol, listener: (...args: any[]) => void): this
  off(eventName: string | symbol, listener: (...args: any[]) => void): this
  addListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this
  removeListener(
    eventName: string | symbol,
    listener: (...args: any[]) => void
  ): this
  removeAllListeners(event?: string | symbol): this
  request<T = unknown>(args: RequestArguments): Promise<T>
}

const ConnectButton = () => {
  const [isConnecting, setIsConnecting] = useState(false)

  const [acc, setAcc] = useState('')

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      const provider = await detectEthereumProvider<MetaMaskEthereumProvider>()

      if (provider) {
        const accounts: string[] = await provider.request({
          method: 'eth_requestAccounts',
        })

        if (accounts && accounts.length > 0) {
          setAcc(accounts[0] as string)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className='p-4 text-black bg-white rounded-lg disabled:bg-gray-400'
    >
      {isConnecting
        ? 'Connecting...'
        : !acc
        ? 'Connect Wallet'
        : `0x${acc.slice(2, 6)}...${acc.slice(-4)}`}
    </button>
  )
}

export default ConnectButton
