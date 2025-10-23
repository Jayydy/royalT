"use client"

import { useState, useEffect } from "react"
import type { Song } from "@/lib/types"

export function useSongs(artistId?: string) {
  const [songs, setSongs] = useState<Song[]>([])

  useEffect(() => {
    if (!artistId) return

    // Load songs from localStorage
    const storedSongs = localStorage.getItem(`songs_${artistId}`)
    if (storedSongs) {
      setSongs(JSON.parse(storedSongs))
    }
  }, [artistId])

  const addSong = (song: Song) => {
    const updatedSongs = [...songs, song]
    setSongs(updatedSongs)
    if (artistId) {
      localStorage.setItem(`songs_${artistId}`, JSON.stringify(updatedSongs))
    }
  }

  const updateSong = (songId: string, updates: Partial<Song>) => {
    const updatedSongs = songs.map((song) => (song.id === songId ? { ...song, ...updates } : song))
    setSongs(updatedSongs)
    if (artistId) {
      localStorage.setItem(`songs_${artistId}`, JSON.stringify(updatedSongs))
    }
  }

  return { songs, addSong, updateSong }
}
