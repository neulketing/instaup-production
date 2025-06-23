import { Router } from 'express'

const router = Router()

// Mock service data
const services = [
  {
    id: 'ig_followers',
    name: '인스타그램 팔로워',
    platform: 'Instagram',
    price: 100,
    minQuantity: 100,
    maxQuantity: 10000,
    description: '실제 한국인 계정에서 팔로우합니다'
  },
  {
    id: 'ig_likes',
    name: '인스타그램 좋아요',
    platform: 'Instagram',
    price: 50,
    minQuantity: 50,
    maxQuantity: 5000,
    description: '게시물에 자연스러운 좋아요를 추가합니다'
  },
  {
    id: 'yt_subscribers',
    name: '유튜브 구독자',
    platform: 'YouTube',
    price: 200,
    minQuantity: 50,
    maxQuantity: 5000,
    description: '실제 활성 계정에서 구독합니다'
  },
  {
    id: 'yt_views',
    name: '유튜브 조회수',
    platform: 'YouTube',
    price: 30,
    minQuantity: 1000,
    maxQuantity: 100000,
    description: '자연스러운 조회수 증가'
  }
]

router.get('/', (req, res): any => {
  res.json({
    success: true,
    data: services,
    message: '서비스 목록 조회 성공'
  })
})

router.get('/:id', (req, res): any => {
  const service = services.find(s => s.id === req.params.id)

  if (!service) {
    return res.status(404).json({
      success: false,
      error: '서비스를 찾을 수 없습니다.'
    })
  }

  res.json({
    success: true,
    data: service,
    message: '서비스 상세 조회 성공'
  })
})

export default router
