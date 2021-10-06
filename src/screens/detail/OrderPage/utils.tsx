import {PermissionsAndroid, Platform} from 'react-native';
import translations from '../../../context/translations';
import {Lang, Question} from '../../../interfaces/Interfaces';
import FileViewer from 'react-native-file-viewer';
import RNHTMLtoPDF, {Pdf} from 'react-native-html-to-pdf';

export const ActionButtonLabels: string[] = [
  translations.EXPORT_TO_PDF,
  translations.START_PRESENTATION,
  translations.CLOSE,
];

export const createPDF = async (topic: string, htmlContent: string) => {
  if (await isPermitted()) {
    let options = {
      //Content to print
      html: htmlContent,
      //File Name
      fileName: topic,
      //File directory
      directory: 'Top Pick',
    };
    let file: Pdf = await RNHTMLtoPDF.convert(options);
    if (file.filePath)
      FileViewer.open(file.filePath).catch((error) => {
        console.log('error opening');
      });
  }
};

export const getHtmlTemplate = (
  questions: Question[],
  title: string,
  lang: Lang,
) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang=${lang}>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Pdf Topic</title>
          <style>
              body {
                  font-size: 16px;
                  color: black;
              }
              h3 {
                  text-align: center;
                font-weight:fold;
              }
              li{
                  padding:8px;
              }
          </style>
      </head>
      <body>
          <h3 style="text-transform: uppercase" >${title}</h3>
          <div style="margin-top:50px">
            <ol>
              ${questions
                .map((item: Question) => ' <li>' + item.title + '</li>')
                .join('\n')}
            </ol> 
          </div>
      </body>
    </html>
  `;
  return htmlContent;
};

export const isPermitted = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log(err);
      return false;
    }
  } else {
    return true;
  }
};
