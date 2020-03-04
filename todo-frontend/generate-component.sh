#!/usr/bin/env bash

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 COMPONENT-NAME DESTINATION" >&2
  exit 1
fi

NAME="$1"
DEST="$2"
FULLPATH="$DEST/$NAME"

if [ -f "$FULLPATH/$NAME.tsx" ]; then
  echo "$FULLPATH/$NAME.tsx already exists. Exiting..."
  exit 1
fi

mkdir "$FULLPATH"
touch "$FULLPATH/$NAME.tsx"
touch "$FULLPATH/styles.module.scss"
touch "$FULLPATH/index.ts"

cat > "$FULLPATH/$NAME.tsx" <<EOL
import React from "react"
//import styles from "./styles.module.scss"

const ${NAME}: React.FC = () => {
  return (
    <div>
      <h1>${NAME}</h1>
    </div>
  )
}

export default ${NAME}
EOL

cat > "$FULLPATH/index.ts" <<EOL
import ${NAME} from "./${NAME}"
export default ${NAME}
EOL
