// Филиппова Екатерина ПИ21-7
// Разработать программу в NodeJS, которая выводит имена файлов каталога, отвечающих следующему условию: размер файла > N байтов;

const fs = require('fs');
const path = require('path');

// Функция для вывода имен файлов размером больше N байтов
function listFilesWithSizeGreaterThanN(directory, N) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(`Ошибка при чтении каталога ${directory}: ${err}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Ошибка при получении информации о файле ${file}: ${err}`);
          return;
        }

        if (stats.isFile() && stats.size > N) {
          console.log(file);
        }
      });
    });
  });
}

// Получаем аргументы командной строки
const args = process.argv.slice(2);

// Проверяем, что переданы аргументы для каталога и размера
if (args.length < 2) {
  console.error('Правильная команда: node имя_файла.js путь_к_каталогу размер_файла_в_байтах');
  process.exit(1);
}

const directoryPath = args[0]; // путь к каталогу
const N = parseInt(args[1]); // размер файла в байтах

listFilesWithSizeGreaterThanN(directoryPath, N);




// Результат работы программы:
//0x0427.ini
//Adobe After Effects 2022.lnk
//Cisco Packet Tracer.lnk
//Desktop - 1.jpg
//figma-to-html.zip
//Group 6.png
//Group 82.png
//Group 84.png
//image 14.png
//image 15.png
//image 54.png
//InceptionV3.docx
//Microsoft Teams.lnk
//OneDrive.lnk
//Praktika_1_Demenchuk.xlsx
//t-5.js
//Total Commander 64 bit.lnk
//registration.png
//Visual Studio Code.lnk
//test.html
//VK Teams.lnk
//Zoom.lnk
//[Skillbox] 1С-разработчик с нуля до PRO (2019).rar
//GR7.txt
//~WRL1903.tmp
//~WRL2741.tmp
//~WRL3583.tmp
//англ на 27.03.xlsx
//Документ1.dg2
//лого.png
//лого.ai
//Лого.rar
//О компании.jpg
//Наше маленькое путешествие.pdf
//Пакет документов.docx
//проект.png
//работа_выплаты.xlsx
//Учет финансов.xlsx
//Филиппова_билет№20.zip
//дз на 05.06.txt
//навыки.txt