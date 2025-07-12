import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div>
      <h2>Tidak Ditemukan!</h2>
      <p>Mohon maaf, halaman yang anda cari tidak ditemukan</p>
      <Link href="./dashboard">Beranda</Link>
    </div>
  )
}