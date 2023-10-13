// This contains the form to add a new deck
// Sits inside the layout, linked from deck library - or nested inside deck library as a toggle component

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Deck, NewDeck } from '../../models/models'
import { addNewDeck } from '../apiClient'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

// interface Props {
//   total: number | undefined
//   showAdd: boolean
// }

function AddNewDeck() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [inputFields, setInputFields] = useState([{ question: '', answer: '' }])
  const { deckId } = useParams()
  const newDeckId = Number(deckId)

  // if (props.total) {
  //   const number = props.total + 1

  const addMutation = useMutation({
    mutationFn: (newDeck: Deck) => addNewDeck(newDeck),
    onSuccess: () => {
      queryClient.invalidateQueries(['deck'])
    },
  })

  function handleFormChange(
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    let inputData = [...inputFields]
    inputData[index][e.target.name] = e.target.value
    setInputFields(inputData)
  }

  function addInputField() {
    let newField = { question: '', answer: '' }

    setInputFields([...inputFields, newField])
  }

  function removeInputField(index: number) {
    let inputData = [...inputFields]
    inputData.splice(index, 1)
    setInputFields(inputData)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log('handle submit called')
    e.preventDefault()

    const target = e.currentTarget
    const form = new FormData(target)

    // The below code puts the data into a readable array of objects
    const deck = {}
    const flashcards = []

    // Iterate over the form data to extract deck data and flashcards
    for (const [key, value] of form.entries()) {
      if (key.startsWith('flashcard')) {
        // If the key starts with 'flashcard', it's a flashcard field
        const [, number, type] = key.split(/(\d+)([A-Za-z]+)/)
        const flashcardIndex = parseInt(number, 10) - 1

        // Create a flashcard object if it doesn't exist yet
        if (!flashcards[flashcardIndex]) {
          flashcards[flashcardIndex] = { number: flashcardIndex + 1 }
        }

        // Map the 'Q' and 'A' to 'question' and 'answer'
        if (type === 'Q') {
          flashcards[flashcardIndex]['question'] = value
        } else if (type === 'A') {
          flashcards[flashcardIndex]['answer'] = value
        }
      } else {
        // For non-flashcard fields, assign them to the deck object
        deck[key] = value
      }
    }

    const newDeck: Deck = {
      id: newDeckId,
      deck_name: String(deck['deckName']),
      author: String(deck['deckAuthor']),
      flashcards: flashcards.filter(Boolean), // Remove undefined entries
    }

    console.log(newDeck)
    addMutation.mutate(newDeck)
    navigate('/deck-library')
  }

  // const flashcard1Question = form.get('flashcard1Q')?.valueOf() as string
  // const flashcard1Answer = form.get('flashcard1A')?.valueOf() as string
  // const flashcard2Question = form.get('flashcard2Q')?.valueOf() as string
  // const flashcard2Answer = form.get('flashcard2A')?.valueOf() as string
  // const flashcard3Question = form.get('flashcard3Q')?.valueOf() as string
  // const flashcard3Answer = form.get('flashcard3A')?.valueOf() as string
  // const flashcard4Question = form.get('flashcard4Q')?.valueOf() as string
  // const flashcard4Answer = form.get('flashcard4A')?.valueOf() as string
  // const flashcard5Question = form.get('flashcard5Q')?.valueOf() as string
  // const flashcard5Answer = form.get('flashcard5A')?.valueOf() as string

  // const newDeck: Deck = {
  //   id: Number(newDeckId),
  //   deck_name: deckName,
  //   author: deckAuthor,
  //   flashcards: [
  //     {
  //       number: 1,
  //       question: flashcard1Question,
  //       answer: flashcard1Answer,
  //     },
  //     { number: 2, question: flashcard2Question, answer: flashcard2Answer },
  //     { number: 3, question: flashcard3Question, answer: flashcard3Answer },
  //     { number: 4, question: flashcard4Question, answer: flashcard4Answer },
  //     { number: 5, question: flashcard5Question, answer: flashcard5Answer },
  //   ],
  // }

  // addMutation.mutate(newDeck)

  return (
    <>
      <div className="addformcontainer">
        <h1>Add new deck</h1>
        <div className="add-form">
          <form onSubmit={handleSubmit}>
            <label htmlFor="deck">Give your deck a name and author</label>
            <input
              className="new deck"
              placeholder="deck name"
              type="text"
              name="deckName"
            ></input>
            <input
              className="new deck"
              placeholder="deck author"
              type="text"
              name="deckAuthor"
            ></input>

            <h4 className="form-label">Enter your flashcards</h4>
            {inputFields.map((input, index) => (
              <>
                <div>
                  <label htmlFor={`${index + 1}`}>Card {index + 1}</label>
                  <input
                    key={`input-q ${index}`}
                    name={`flashcard${index + 1}Q`}
                    placeholder="question"
                    // value={input.question}
                    onChange={(e) => handleFormChange(index, e)}
                  />
                  <input
                    key={`input-a ${index}`}
                    name={`flashcard${index + 1}A`}
                    placeholder="answer"
                    // value={input.answer}
                    onChange={(e) => handleFormChange(index, e)}
                  />
                  <button onClick={() => removeInputField(index)}>
                    Remove card
                  </button>
                </div>
              </>
            ))}
            <button type="button" onClick={addInputField}>
              Add card
            </button>
            <button className="form-btn" type="submit">
              Submit entire deck
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default AddNewDeck
