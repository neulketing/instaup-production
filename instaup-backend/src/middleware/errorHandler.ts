import { Request, Response, NextFunction } from 'express'

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction): any => {
  console.error('Error:', error)

  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: '입력 데이터가 올바르지 않습니다.',
      details: error.message
    })
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: '유효하지 않은 토큰입니다.'
    })
  }

  res.status(500).json({
    success: false,
    error: '서버 내부 오류가 발생했습니다.'
  })
}
