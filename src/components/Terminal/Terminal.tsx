import React from 'react'
import ActualPrompt from './ActualPrompt/ActualPrompt'
import CommandResults from './CommandResults/CommandResults'
import { enteredCommand, validCommand } from './types'
import { IntroLine } from 'generated/graphql'
import Intro from './Intro/Intro'

interface MyProps {
  introLines?: IntroLine[]
}

interface MyState {
  introArray: string[]
  enteredCommands: enteredCommand[]
  showPrompt: boolean
  typedCommand: string
}

class Terminal extends React.Component<MyProps, MyState> {
  typedCommandInput = React.createRef<HTMLInputElement>()
  state: MyState = {
    introArray: [],
    enteredCommands: [],
    showPrompt: false,
    typedCommand: '',
  }

  componentDidMount() {
    let starterArray = this.props.introLines?.map((line) => line.line)

    const createTypingEffect = async (text: string, index: number) => {
      return Promise.all(
        text.split('').map(
          (character, characterIndex) =>
            new Promise((res) => {
              setTimeout(() => {
                this.setState((state) => ({
                  introArray: [
                    ...state.introArray.slice(0, index),
                    [...state.introArray][index] + character,
                    ...state.introArray.slice(index + 1),
                  ],
                }))
                res(null)
              }, 100 * characterIndex)
            })
        )
      )
    }

    const TypeIntroLines = async () => {
      let i = 0
      if (starterArray) {
        for (const starterText of starterArray) {
          // Setting empty string for each line in starterArray so we don't get undefined as first character
          this.setState((state) => ({
            introArray: [...state.introArray, ''],
          }))

          await createTypingEffect(starterText || '', i)
          i++
        }
      }
      // Showing prompt after last line is typed
      setTimeout(() => {
        this.setState({ showPrompt: true })
      }, 400)
    }

    setTimeout(() => TypeIntroLines(), 400)
    document.addEventListener('keydown', this.listenForAnyKeyPress, false)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.listenForAnyKeyPress, false)
  }

  listenForAnyKeyPress = (e: KeyboardEvent) => {
    this.typedCommandInput.current?.focus()
    if (e.key === 'Enter') {
      this.handleCommandSubmit()
    }
  }

  handleCommandSubmit = () => {
    let invalidCommand = true
    this.validCommands.forEach((command) => {
      if (this.state.typedCommand === command.command) {
        command.action()
        invalidCommand = false
      }
    })

    if (invalidCommand) {
      this.setState((state) => ({
        enteredCommands: [...state.enteredCommands, { command: state.typedCommand, notFound: true }],
        typedCommand: '',
      }))
    }
  }

  handleTypedCommand = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ typedCommand: e.target.value })
  }

  validCommands: validCommand[] = [
    {
      command: 'clear',
      description: 'Clear the terminal',
      action: () => {
        this.setState({
          introArray: [],
          enteredCommands: [],
          typedCommand: '',
        })
      },
    },
    {
      command: 'help',
      description: 'Show help',
      action: () =>
        this.setState((state) => ({
          enteredCommands: [
            ...state.enteredCommands,
            { command: state.typedCommand, notFound: false, jsx: <div>help section</div> },
          ],
          typedCommand: '',
        })),
    },
    { command: 'goto ', description: 'Display list of links on a website', action: () => {} },
  ]

  render() {
    const { introArray, enteredCommands, showPrompt, typedCommand } = this.state
    return (
      <div className="w-1/2 h-1/2 p-5 flex items-start justify-start bg-clip-padding bg-slate-900 backdrop-filter backdrop-blur-xl bg-opacity-60 border border-gray-900 rounded text-white">
        <div className="flex flex-col">
          <Intro introArray={introArray} />
          <CommandResults enteredCommands={enteredCommands} />
          <ActualPrompt
            showPrompt={showPrompt}
            typedCommand={typedCommand}
            onTypedCommand={this.handleTypedCommand}
            inputRef={this.typedCommandInput}
          />
        </div>
      </div>
    )
  }
}

export default Terminal
