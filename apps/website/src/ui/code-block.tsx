import {docsStyles} from '../docs/docs-styles'
import {CopyButton} from './copy-button'
import {type CodeLanguage, highlight} from './highlight'

const styles = docsStyles()

type CodeBlockProps = {
  code: string
  language?: CodeLanguage
  /** Shown in the header in place of the language — a file name, say. */
  title?: string
}

export const CodeBlock = async ({code, language = 'tsx', title}: CodeBlockProps) => {
  const html = await highlight(code, language)

  return (
    <div className={styles.codeBlock()}>
      <div className={styles.codeBlockHeader()}>
        <span>{title ?? language}</span>
        <CopyButton className={styles.codeCopy()} iconClassName="size-3.5" source="code_block" text={code} />
      </div>
      <div className={styles.codeBlockBody()} dangerouslySetInnerHTML={{__html: html}} />
    </div>
  )
}
