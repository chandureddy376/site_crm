import { Injectable, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable()

@Pipe({
    name: 'unique',
    pure: false
  })
  export class UniquePipe implements PipeTransform {
    transform(items: any[], args: any[]): any {
        // filter items array, items which match and return true will be kept, false will be filtered out

        return _.uniqBy(items, args);
    }
}

@Pipe({
  name: 'NameFilter',
  pure: false
})
export class SearchPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      let rVal = (val.CustomerName.toLocaleLowerCase().includes(args)) || (val.CustomerName.includes(args)) ||
       (val.Executivename.includes(args)) || (val.Executivename.toLocaleLowerCase().includes(args)) || (val.number.includes(args));
      return rVal;
    })

  }
}

@Pipe({
  name: 'ExecNameFilter',
  pure: false
})
export class ExecutivenameRetail implements PipeTransform {
  transform(value: any[], args?: string): any[] {
    if (!args) {
      return value;
    }

    // const searchTerm = args.toLocaleLowerCase();
    
    return value.filter((val) => {
      const customerName = val.CustomerName ? val.CustomerName.toLocaleLowerCase() : '';
      const executiveName = val.Executivename ? val.Executivename.toLocaleLowerCase() : '';
      const name = val.name ? val.name.toLocaleLowerCase() : '';
      const number = val.number ? val.number : '';

      return (
        customerName.includes(args) ||
        executiveName.includes(args) ||
        name.includes(args) ||
        number.includes(args)
      );
    });
  }
}

@Pipe({
  name: 'CommonNameFilter',
  pure: false
})
export class SearchPipeCommon implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      let rVal = (val.CustomerName.toLocaleLowerCase().includes(args)) || (val.CustomerName.includes(args)) ||
       (val.Executivename.includes(args)) || (val.Executivename.toLocaleLowerCase().includes(args)) || (val.number.includes(args));
      return rVal;
    })

  }
}

@Pipe({
  name: 'PropertyFilter',
  pure: false
})
export class Searchproperty implements PipeTransform {
  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      let rVal = (val.registered_property.toLocaleLowerCase().includes(args)) || (val.registered_property.includes(args));
      return rVal;
    })

  }
}

@Pipe({
  name: 'duplicationPipe',
  pure: false
})

export class duplicatePipe implements PipeTransform {
    transform(value: any): any{
        if(value!== undefined && value!== null){
            return _.uniqBy(value, 'number');
        }
        return value;
    }
}

@Pipe({
  name: 'splicePipe',
  pure: false
})
export class SplicePipe implements PipeTransform {
  transform(value: any[], start: number, deleteCount: number): any[] {
    if (!Array.isArray(value)) return value;
    return value.slice(start, start + deleteCount);
  }
}

@Pipe({ name: 'sanitizeHtml'})

export class SanitizeHtmlPipe implements PipeTransform {
 constructor(private sanitizer: DomSanitizer) { }
 transform(value: any): any {
 return this.sanitizer.bypassSecurityTrustHtml(value);
 }
}

// @Pipe({
//   name: 'highlightNumbers'
// })
// export class HighlightNumbersPipe implements PipeTransform {
//   transform(value: string): Array<{text: string, isPhoneNumber: boolean}> {
//   if (!value) return [];

//   // Split text by phone numbers, keep them separate in array
//   // We'll use a regex to split and keep phone numbers

//   const regex = /\b(?:91)?\d{10}\b/g;

//   let result: Array<{text: string, isPhoneNumber: boolean}> = [];

//   let lastIndex = 0;
//   let match;

//   while ((match = regex.exec(value)) !== null) {
//     // text before phone number
//     if (match.index > lastIndex) {
//       result.push({ text: value.substring(lastIndex, match.index), isPhoneNumber: false });
//     }
//     // matched phone number
//     result.push({ text: match[0], isPhoneNumber: true });

//     lastIndex = regex.lastIndex;
//   }

//   // text after last phone number
//   if (lastIndex < value.length) {
//     result.push({ text: value.substring(lastIndex), isPhoneNumber: false });
//   }

//   return result;
// }

// }

@Pipe({
  name: 'highlightNumbers'
})
export class HighlightNumbersPipe implements PipeTransform {

  transform(value: string): Array<{ text: string; isPhoneNumber: boolean; isLineBreak?: boolean;  isBold?: boolean ; isLink?: boolean}> {
  if (!value) return [];

  // Remove unnecessary blank lines, optional
  value = value.replace(/\n\s*\n/g, '\n\n').trim();

  const regex = /\b(?:91)?\d{10}\b/g;
  let result = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(value)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = value.substring(lastIndex, match.index);
      result = result.concat(this.splitByLines(textBefore));
    }

    result.push({ text: match[0], isPhoneNumber: true });

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < value.length) {
    result = result.concat(this.splitByLines(value.substring(lastIndex)));
  }

  return result;
}

  private splitByLines(text: string): Array<{ text: string; isPhoneNumber: boolean; isLineBreak?: boolean; isBold?: boolean ; isLink?: boolean}> {
  const lines = text.split('\n');
  let result = [];

  lines.forEach((line, index) => {
    if (line !== '') {
      // result.push({ text: line, isPhoneNumber: false });
        result = result.concat(this.extractBold(line));
    }
    // Add a line break *even* for blank lines
    if (index < lines.length - 1) {
      result.push({ text: '\n', isPhoneNumber: false, isLineBreak: true });
    }
  });

  return result;
}

// private extractBold(text: string): Array<{ text: string; isPhoneNumber: boolean; isBold?: boolean ,isItalic?: boolean; isLink?: boolean }> {
//   const result = [];
//   const regex = /(\*(.*?)\*)|(_(.*?)_)/g;
//   const urlRegex = /(https?:\/\/[^\s]+)/g;
//   let lastIndex = 0;
//   let match;

//   while ((match = regex.exec(text)) !== null) {
//     if (match.index > lastIndex) {
//       result.push({
//         text: text.substring(lastIndex, match.index),
//         isPhoneNumber: false
//       });
//     }

//     // result.push({
//     //   text: match[1],
//     //   isPhoneNumber: false,
//     //   isBold: true
//     // });
//       if (match[1]) {
//       // Bold match
//       result.push({
//         text: match[2],
//         isPhoneNumber: false,
//         isBold: true
//       });
//     } else if (match[3]) {
//       // Italic match
//       result.push({
//         text: match[4],
//         isPhoneNumber: false,
//         isItalic: true
//       });
//     }

//     lastIndex = regex.lastIndex;
//   }

//   if (lastIndex < text.length) {
//     result.push({
//       text: text.substring(lastIndex),
//       isPhoneNumber: false
//     });
//   }
//   console.log(result)
//   return result;
// }

private extractBold(text: string): Array<{ text: string; isPhoneNumber: boolean; isBold?: boolean; isItalic?: boolean; isLink?: boolean }> {
  const result = [];
  const boldItalicRegex = /(\*(.*?)\*)|(_(.*?)_)/g;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let lastIndex = 0;
  let match;

  while ((match = boldItalicRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      // Extract links inside the plain text between lastIndex and match.index
      const plainText = text.substring(lastIndex, match.index);
      
      // Extract links from plainText
      let lastUrlIndex = 0;
      let urlMatch;
      while ((urlMatch = urlRegex.exec(plainText)) !== null) {
        if (urlMatch.index > lastUrlIndex) {
          result.push({
            text: plainText.substring(lastUrlIndex, urlMatch.index),
            isPhoneNumber: false
          });
        }
        result.push({
          text: urlMatch[0],
          isPhoneNumber: false,
          isLink: true
        });
        lastUrlIndex = urlRegex.lastIndex;
      }
      if (lastUrlIndex < plainText.length) {
        result.push({
          text: plainText.substring(lastUrlIndex),
          isPhoneNumber: false
        });
      }
    }

    // Now push the bold or italic match
    if (match[1]) {
      // Bold
      result.push({
        text: match[2],
        isPhoneNumber: false,
        isBold: true
      });
    } else if (match[3]) {
      // Italic
      result.push({
        text: match[4],
        isPhoneNumber: false,
        isItalic: true
      });
    }

    lastIndex = boldItalicRegex.lastIndex;
  }

  // After last bold/italic match, extract links from remaining text
  if (lastIndex < text.length) {
    const plainText = text.substring(lastIndex);
    
    let lastUrlIndex = 0;
    let urlMatch;
    while ((urlMatch = urlRegex.exec(plainText)) !== null) {
      if (urlMatch.index > lastUrlIndex) {
        result.push({
          text: plainText.substring(lastUrlIndex, urlMatch.index),
          isPhoneNumber: false
        });
      }
      result.push({
        text: urlMatch[0],
        isPhoneNumber: false,
        isLink: true
      });
      lastUrlIndex = urlRegex.lastIndex;
    }
    if (lastUrlIndex < plainText.length) {
      result.push({
        text: plainText.substring(lastUrlIndex),
        isPhoneNumber: false
      });
    }
  }
  return result;
}


  // transform(value: string): Array<{ text: string; isPhoneNumber: boolean; isLineBreak?: boolean }> {
  //   if (!value) return [];

  //    value = value.replace(/\n\s*\n/g, '\n').trim();

  //    console.log('Cleaned value:', JSON.stringify(value));
  //   const regex = /\b(?:91)?\d{10}\b/g;
  //   let result: Array<{ text: string; isPhoneNumber: boolean; isLineBreak?: boolean }> = [];

  //   let lastIndex = 0;
  //   let match;

  //   while ((match = regex.exec(value)) !== null) {
  //     // Handle text before the match
  //     if (match.index > lastIndex) {
  //       const chunk = value.substring(lastIndex, match.index);
  //         result = result.concat(this.splitByLineBreaks(chunk, false));
  //     }

  //     // Handle matched phone number
  //     result.push({ text: match[0], isPhoneNumber: true });

  //     lastIndex = regex.lastIndex;
  //   }

  //   // Remaining text after last match
  //   if (lastIndex < value.length) {
  //     const chunk = value.substring(lastIndex);
  //       result = result.concat(this.splitByLineBreaks(chunk, false));
  //   }

  //   return result;
  // }

  // private splitByLineBreaks(text: string, isPhoneNumber: boolean) {
  //   const parts = text.split('\n');
  //   const result = [];
  //   let emptyLineCount = 0;

  //   parts.forEach(part => {
  //     if (part.trim().length > 0) {
  //       // If there were empty lines before, add only one line break before this text
  //       if (emptyLineCount > 0) {
  //         result.push({ text: '\n', isPhoneNumber: false, isLineBreak: true });
  //         emptyLineCount = 0;
  //       }
  //       result.push({ text: part, isPhoneNumber });
  //     } else {
  //       // Count empty lines, but don't add multiple line breaks
  //       emptyLineCount++;
  //     }
  //   });

  //   // If text ends with empty lines, add a single line break at the end
  //   if (emptyLineCount > 0) {
  //     result.push({ text: '\n', isPhoneNumber: false, isLineBreak: true });
  //   }

  //   return result;
  // }



  // private splitByLineBreaks(text: string, isPhoneNumber: boolean) {
  //   const parts = text.split('\n');
  //   const result = [];

  //   parts.forEach((part, index) => {
  //     if (part) {
  //       result.push({ text: part, isPhoneNumber });
  //     }
  //     if (index < parts.length - 1) {
  //       result.push({ text: '\n', isPhoneNumber: false, isLineBreak: true });
  //     }
  //   });

  //   return result;
  // }
}

@Pipe({
  name: 'highlightText'
})
export class HighlightTextPipe implements PipeTransform {
  transform(value: string, search: string): string {
    if (!search || !value) return value;
    const pattern = search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') // escape special chars
    const regex = new RegExp(pattern, 'gi');
    return value.replace(regex, match => `<mark>${match}</mark>`);
  }
}



