import { Html, Head, Main, NextScript } from 'next/document'
 
export default function Document() {
  return (
    <Html lang="en">
        <Head>
          <link 
          rel='stylesheet'
          href='assets/css/sweetalert2.min.css'
          />
          <link 
          rel="stylesheet" 
          href="assets/css/bootstrap.min.css"
          />
          <link 
          rel="stylesheet" 
          href="assets/css/style.css"
          />

          <link
              id="primaryColor"
              rel="stylesheet"
              href="assets/css/blue-color.css" // Set the default stylesheet path
          />
        </Head>
        <body className="light-theme">
            <Main />
            <NextScript />
        </body>
    </Html>
  )
}