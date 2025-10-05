import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, UserPlus, Share2, Copy, Gift } from 'lucide-react'
import { useFriendsStore } from '../../store/friends'
import { friendsApi } from '../../api/friends'
import { cn } from '../../utils/cn'

export function NetworkPage() {
  const { t } = useTranslation()
  const { friends, referralCode, referralLink, referralStats, setFriends, setReferralCode, setReferralLink, setReferralStats } = useFriendsStore()
  const [friendId, setFriendId] = useState('')
  const [showCopied, setShowCopied] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [friendsData, referralData, statsData] = await Promise.all([
        friendsApi.getFriends(),
        friendsApi.getReferralCode(),
        friendsApi.getReferralStats()
      ])
      
      setFriends(friendsData)
      setReferralCode(referralData.referralCode)
      setReferralLink(referralData.referralLink)
      setReferralStats(statsData)
    } catch (error) {
      console.error('Failed to load network data:', error)
    }
  }

  const handleAddFriend = async () => {
    if (!friendId.trim()) return
    
    try {
      await friendsApi.addFriend({ friendTelegramId: friendId })
      setFriendId('')
      loadData() // Refresh data
      alert('Friend added successfully!')
    } catch (error) {
      console.error('Failed to add friend:', error)
      alert('Failed to add friend')
    }
  }

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('friends.title')}</h1>
        
        {/* Referral Stats */}
        {referralStats && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{referralStats.totalReferrals}</div>
              <div className="text-sm text-gray-500">{t('friends.totalReferrals')}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Gift className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{referralStats.totalEarnings}</div>
              <div className="text-sm text-gray-500">{t('friends.totalEarnings')}</div>
            </div>
          </div>
        )}

        {/* Referral Code Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('friends.referralCode')}</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-white rounded-lg p-3 border">
              <div className="text-sm text-gray-500 mb-1">{t('friends.referralLink')}</div>
              <div className="font-mono text-sm text-gray-900 break-all">{referralLink}</div>
            </div>
            <button
              onClick={handleCopyReferralLink}
              className={cn(
                'btn flex items-center space-x-2',
                showCopied ? 'btn-secondary' : 'btn-primary'
              )}
            >
              {showCopied ? (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Add Friend Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('friends.addFriend')}</h2>
          <div className="flex space-x-4">
            <input
              type="text"
              value={friendId}
              onChange={(e) => setFriendId(e.target.value)}
              placeholder="Enter friend's Telegram ID"
              className="input flex-1"
            />
            <button
              onClick={handleAddFriend}
              disabled={!friendId.trim()}
              className="btn btn-primary"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Friend
            </button>
          </div>
        </div>

        {/* Friends List */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Friends ({friends.length})</h2>
          {friends.length > 0 ? (
            <div className="space-y-3">
              {friends.map((friend) => (
                <div key={friend.id} className="bg-white border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {friend.friend.firstName} {friend.friend.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{friend.friend.username || 'No username'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Total Spins</div>
                      <div className="font-medium text-gray-900">
                        {friend.friend.balance?.totalSpins || 0}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No friends yet</p>
              <p className="text-sm">Invite friends to start earning referral rewards!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}