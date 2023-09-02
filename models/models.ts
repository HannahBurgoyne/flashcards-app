export interface NewFlashcard {
  question: string
  answer: string
}

export interface Flashcard extends NewFlashcard {
  id: number
}

export interface FlashcardData {
  flashcardId: number,
		deckId: number,
		number: number,
		question: string,
		answer: string
}

export interface NewDeck {
  deck_name: string
  author: string
}

export interface Deck extends NewDeck {
  id: number
  flashcards: Flashcard[]
}

export interface AllDecks {
  decks: Deck[]
}


