import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#040000', // Matches the very dark oklch(0.13 0 0) background approximately
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#faeaea', // Matches foreground oklch(0.98 0 0)
          borderRadius: '4px',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 18V5" />
          <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
          <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
          <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
          <path d="M18 18a4 4 0 0 0 2-7.464" />
          <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
          <path d="M6 18a4 4 0 0 1-2-7.464" />
          <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
