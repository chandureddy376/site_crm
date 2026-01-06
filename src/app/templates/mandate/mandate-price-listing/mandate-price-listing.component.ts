import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { sharedservice } from '../../../shared.service';
import { mandateservice } from '../../../mandate.service';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-mandate-price-listing',
  templateUrl: './mandate-price-listing.component.html',
  styleUrls: ['./mandate-price-listing.component.css']
})
export class MandatePriceListingComponent implements OnInit {
  private subscription: Subscription;
  constructor(private readonly _sharedService: sharedservice, private readonly _mandateService: mandateservice, private renderer: Renderer2, private sanitizer: DomSanitizer) { }

  propertyList: any;
  copyOfPropertyList: any;
  property_name: string = '';
  builders: any;
  builderid: any;
  properties: any;
  selectedBuilders: any;
  selectedProperties: any;
  selectedPropertiesIds: number[] = []
  projectInfo: any;
  filterLoader: boolean = true;
  uploads: string[] = [];
  brochureFiles: any[] = [];
  priceSheetuploads0: string[] = [];
  priceSheetFiles0: any[] = [];
  priceSheetuploads: string[] = [];
  priceSheetFiles: any[] = [];
  priceSheetuploads2: string[] = [];
  priceSheetFiles2: any[] = [];
  priceSheetuploads3: string[] = [];
  priceSheetFiles3: any[] = [];
  priceSheetuploads4: string[] = [];
  priceSheetFiles4: any[] = [];
  videouploadsdata0: string[] = [];
  videoFiles0: any[] = [];
  videouploadsdata: string[] = [];
  videoFiles: any[] = [];
  videouploadsdata2: string[] = [];
  videoFiles2: any[] = [];
  videouploadsdata3: string[] = [];
  videoFiles3: any[] = [];
  videouploadsdata4: string[] = [];
  videoFiles4: any[] = [];
  btnName: string = 'Add Property';
  selectedOpt: any;
  showCopiedBtn: boolean = false;
  selectedEditProp: any;
  roleid: any;
  apiKey: any;
  tinymce: any;
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  flooruploads: string[] = [];
  floorFiles: any[] = [];
  flooruploads0: string[] = [];
  floorFiles0: any[] = [];
  flooruploads2: string[] = [];
  floorFiles2: any[] = [];
  flooruploads3: string[] = [];
  floorFiles3: any[] = [];
  flooruploads4: string[] = [];
  floorFiles4: any[] = [];
  sqftArray: any[] = [];
  sqftArraylength: any
  sqftArray0: any[] = [];
  sqftArraylength0: any
  sqftArray2: any[] = [];
  sqftArraylength2: any
  sqftArray3: any[] = [];
  sqftArraylength3: any
  sqftArray4: any[] = [];
  sqftArraylength4: any
  selectedPriceSheetNum: any;
  selectedFloorPlanNum: any = '';
  selectedVideoNum: any = '';

  //used for edit floor plan
  floorFilesOnUpdate: any[] = [];
  floorFilesOnUpdate0: any[] = [];
  floorFilesOnUpdate2: any[] = [];
  floorFilesOnUpdate3: any[] = [];
  floorFilesOnUpdate4: any[] = [];
  flooruploadsOnUpdate: string[] = [];
  flooruploadsOnUpdate0: string[] = [];
  flooruploadsOnUpdate2: string[] = [];
  flooruploadsOnUpdate3: string[] = [];
  flooruploadsOnUpdate4: string[] = [];
  updateonPostSqrt: any[] = [];
  updateonPostSqrt0: any[] = [];
  updateonPostSqrt2: any[] = [];
  updateonPostSqrt3: any[] = [];
  updateonPostSqrt4: any[] = [];

  videouploadsdataUpdate0: string[] = [];
  videoFilesUpdate0: any[] = [];
  videouploadsdataUpdate: string[] = [];
  videoFilesUpdate: any[] = [];
  videouploadsdataUpdate2: string[] = [];
  videoFilesUpdate2: any[] = [];
  videouploadsdataUpdate3: string[] = [];
  videoFilesUpdate3: any[] = [];
  videouploadsdataUpdate4: string[] = [];
  videoFilesUpdate4: any[] = [];
  postOnUpdate: string = '';
  selectedEditPriceSheet: any;

  ngOnInit() {
    this.roleid = localStorage.getItem('Role');

    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    this.getAllProperties();
    this.getAllBuilders();

    let node: any = document.createElement('link');
    node.setAttribute('href', 'https://lead247.in/assets/css/material-dashboard.css?v=3.0.0');
    node.rel = 'stylesheet';
    node.type = 'text/css';
    node.id = "dashboard_material_css";
    document.getElementsByTagName('head')[0].appendChild(node);
  }

  ngOnDestroy() {
    let element = document.getElementById('dashboard_material_css');
    if (element) {
      element.parentNode.removeChild(element);
    }

    let element2 = document.getElementById('dashboard_dynamic_links_5');
    if (element2) {
      element2.parentNode.removeChild(element2);
    }
    // Clean up any resources here, such as unsubscribing
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if(this.hoverSubscription){
      this.hoverSubscription.unsubscribe();
    }
  }

  removeTinyMce() {
    if (typeof (window as any).tinymce !== 'undefined') {
      (window as any).tinymce.remove('#basic-example');
      (window as any).tinymce.remove('#basic-example2');
    }

    // 2. Remove the TinyMCE script tag (CDN)
    let tinyMceScript = document.getElementById('dashboard_dynamic_links_5');
    if (tinyMceScript) {
      tinyMceScript.parentNode.removeChild(tinyMceScript);
    }

    let allCustomScripts = document.querySelectorAll('script[src*="scripts.js"]');
    Array.from(allCustomScripts).forEach(script => {
      script.parentNode.removeChild(script);
    });

    // 4. Remove any TinyMCE CSS if added dynamically
    let tinyMceCss = document.querySelector('link[href*="tinymce"]');
    if (tinyMceCss) {
      tinyMceCss.parentNode.removeChild(tinyMceCss);
    }
  }

  getTinyMceCode() {
    this._sharedService.getTinyMceCode().subscribe((resp) => {
      if (resp.status == 'True') {
        this.apiKey = resp.tiny_mce[0].tiny_mce_lead247;
        if (!document.getElementById('dashboard_dynamic_links_5')) {
          let node2: HTMLScriptElement = document.createElement('script');
          node2.src = `https://cdnjs.cloudflare.com/ajax/libs/tinymce/4.9.11/tinymce.min.js`;
          node2.type = 'text/javascript';
          node2.charset = 'utf-8';
          node2.id = "dashboard_dynamic_links_5"; // Make sure script tag has a unique ID
          document.getElementsByTagName('head')[0].appendChild(node2);

          node2.onload = () => {
            // Load your custom scripts after TinyMCE is loaded
            if (typeof (window as any).tinymce !== 'undefined') {
              let node3: HTMLScriptElement = document.createElement('script');
              node3.src = `../../../../assets/js/scripts.js?t=${new Date().getTime()}`;
              node3.type = 'text/javascript';
              node3.charset = 'utf-8';
              document.getElementsByTagName('head')[0].appendChild(node3);
            }
          };
        }
        // Initialize TinyMCE after script load
        setTimeout(() => {
          if (typeof (window as any).tinymce !== 'undefined' && (this.selectedEditProp == null || this.selectedEditProp == undefined)) {
            this.initializeTinyMce();
          } else if (typeof (window as any).tinymce !== 'undefined' && (this.selectedEditProp != null && this.selectedEditProp != undefined)) {
            this.editinitializeTinyMce();
          }
        }, 500); // Adding some delay to ensure TinyMCE is loaded
      }
    })
  }

  initializeTinyMce() {
    if (this.isTinyMceInitialized()) {
      // Remove any existing editor instance before initializing again
      (window as any).tinymce.remove('#basic-example');
    }

    // Initialize or re-initialize TinyMCE
    (window as any).tinymce.init({
      selector: 'textarea#basic-example', // Select the correct textarea
      plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount autosave',
      toolbar: 'undo redo styleselect bold italic alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
      autosave_restore_when_empty: false,
      autosave_prefix: 'blog-autosave-',
      autosave_interval: '3s',
      paste_preprocess: function (plugin, args) {
        args.content = ''; // Modify the content if needed
      },
      cleanup: true,
      setup: (editor: any) => {
        // Sync TinyMCE content with ngModel (projectInfo)
        editor.on('change', () => {
          this.projectInfo = editor.getContent();
        });
      }
    });

    // Set the content of TinyMCE to match the ngModel (projectInfo)
    if (this.projectInfo) {
      (window as any).tinymce.get('basic-example').setContent(this.projectInfo);
    }
  }

  editinitializeTinyMce() {
    if (this.isTinyMceInitialized2()) {
      // Remove any existing editor instance before initializing again
      (window as any).tinymce.remove('#basic-example2');
    }

    // Initialize or re-initialize TinyMCE
    (window as any).tinymce.init({
      selector: 'textarea#basic-example2', // Select the correct textarea
      plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount autosave',
      toolbar: 'undo redo styleselect bold italic alignleft aligncenter alignright alignjustify | bullist numlist outdent indent',
      autosave_restore_when_empty: false,
      autosave_prefix: 'blog-autosave-',
      autosave_interval: '3s',
      paste_preprocess: function (plugin, args) {
        args.content = ''; // Modify the content if needed
      },
      cleanup: true,
      setup: (editor: any) => {
        // Sync TinyMCE content with ngModel (projectInfo)
        editor.on('change', () => {
          this.projectInfo = editor.getContent();
        });
      }
    });

    // Set the content of TinyMCE to match the ngModel (projectInfo)
    if (this.projectInfo) {
      (window as any).tinymce.get('basic-example2').setContent(this.projectInfo);
    }
  }

  isTinyMceInitialized(): boolean {
    // Check if TinyMCE is already initialized on the target textarea
    return (window as any).tinymce && (window as any).tinymce.get('basic-example');
  }

  isTinyMceInitialized2(): boolean {
    // Check if TinyMCE is already initialized on the target textarea
    return (window as any).tinymce && (window as any).tinymce.get('basic-example2');
  }

  getAllProperties() {
    this._mandateService.getPriceList().subscribe((resp) => {
      if (resp.status == 'True') {
        this.propertyList = resp['result'];
        this.copyOfPropertyList = resp['result'];
        setTimeout(() => {
          if (this.selectedEditProp) {
            let selectedprop = this.propertyList.filter((data) => {
              return this.selectedEditProp.detailsId == data.detailsId;
            });
            this.editProp(selectedprop[0])
          }
        }, 1000)
      } else {
        this.propertyList = [];
      }
    })
  }

  getAllBuilders() {
    this._sharedService
      .builderlist()
      .subscribe(builderlist => {
        this.builders = builderlist;
        this.filterLoader = false;
      });
  }

  builderchange(event) {
    this.builderid = this.selectedBuilders;
    this.selectedProperties = [];
    this.properties = [];
    $('#property_Dropdown').dropdown('clear');
    if (this.selectedBuilders != null || this.selectedBuilders != undefined) {
      this._sharedService
        .getpropertiesbybuilder(this.builderid)
        .subscribe(propertylist => {
          let properties = propertylist['Properties'];
          this.properties = properties.filter((data) => {
            return !this.propertyList.some((prop) => data.id === prop.PropId);
          });
        });
    }
  }

  //here based on the search property name the lsit will be filtered.
  searchproperty() {
    if (this.property_name) {
      this.propertyList = this.copyOfPropertyList.filter((prop) => {
        return prop.PropName.toLowerCase().includes(this.property_name.toLowerCase())
      });
    } else {
      this.propertyList = this.copyOfPropertyList;
    }
  }

  // Method to upload brochure
  brochureImageuploads(i, event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.filterLoader = true;
    if (files.length == 0) {
      this.filterLoader = false;
    }

    if (files && files.length > 0) {
      const file = files[0]; // Only one file, so we take the first one

      if (file.type !== 'application/pdf') {
        this.filterLoader = false;
        swal({
          title: 'Invalid File Type',
          text: 'Only PDF files are allowed.',
          type: "error",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          input.value = '';
          if (this.btnName == 'Add Property') {
            this.brochureFiles = [];
          }
        });
        return;
      } else {
        // Validate the file size
        if (file.size > 100000000) {
          this.filterLoader = false;
          swal({
            title: 'File Size Exceeded',
            text: 'File Size limit is 100MB',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            input.value = '';
            if (this.btnName == 'Add Property') {
              this.brochureFiles = [];
              this.uploads = [];
            }
          });
        } else {
          // Push the file to closurefiles and read the file
          this.brochureFiles = [file];  // Only keep the new file
          this.uploads = [];
          const replacefile = this.brochureFiles[0];
          // Remove '+' from the name
          const newFileName = replacefile.name.replace(/[+]/g, '');
          const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
          this.brochureFiles[0] = updatedFile;
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.uploads.push(event.target.result);
            this.filterLoader = false;
          };
          reader.readAsDataURL(file);
          $('#customFile' + i).siblings(".file-label-" + i).addClass("selected").html(file.name);

          if (this.btnName == 'Edit Property') {
            this.updateBrochure();
          }
        }
      }
    }
  }

  removeBrochureImage(i) {
    this.uploads = [];
    this.brochureFiles = [];
    if (this.uploads.length == 0) {
      $("#customFile" + i).val('');
      $('.file-label-' + i).html('Choose file ');
    } else {

    }
    // alert(this.uploads.length);
  }

  priceSheetImageuploads(i, event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.filterLoader = true;
    if (files.length == 0) {
      this.filterLoader = false;
    }

    if (files && files.length > 0) {
      // Validate the file size
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type !== 'application/pdf' && file.type !== 'image/png' && file.type !== 'image/jpeg') {
          this.filterLoader = false;
          swal({
            title: 'Invalid File Type',
            text: 'Only PDF/PNG/JPEG files are allowed.',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            input.value = '';
            // this.floorFiles = [];
          });
          return;
        } else {
          if (file.size > 50000000) {
            this.filterLoader = false;
            swal({
              title: 'File Size Exceeded',
              text: 'File Size limit is 50MB',
              type: "error",
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              input.value = '';
              // this.priceSheetFiles = [];
            });
          } else {
            // Push the file to closurefiles and read the file
            if (this.selectedPriceSheetNum == '1') {
              const file = files[i];
              const fileName = file.name;
              $('#pricecustomFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);
              this.priceSheetFiles = [file];
              this.priceSheetuploads = [];
              const replacefile = this.priceSheetFiles[0];
              // Remove '+' from the name
              const newFileName = replacefile.name.replace(/[+]/g, '');
              const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
              this.priceSheetFiles[0] = updatedFile;
              const reader = new FileReader();
              reader.onload = (event: any) => {
                this.priceSheetuploads.push(event.target.result);
                this.filterLoader = false;
              };
              reader.readAsDataURL(file);
              if (this.btnName == 'Edit Property' && this.postOnUpdate == '') {
                this.updatePricesheet('1');
              } else if (this.btnName == 'Edit Property' && this.postOnUpdate == 'post') {
                this.postPricesheetOnUpdate();
              }

            } else if (this.selectedPriceSheetNum == '2') {
              const file = files[i];
              const fileName = file.name;
              $('#pricecustomFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);
              this.priceSheetFiles2 = [file];
              this.priceSheetuploads2 = [];
              const replacefile = this.priceSheetFiles2[0];
              // Remove '+' from the name
              const newFileName = replacefile.name.replace(/[+]/g, '');
              const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
              this.priceSheetFiles2[0] = updatedFile;
              const reader = new FileReader();
              reader.onload = (event: any) => {
                this.priceSheetuploads2.push(event.target.result);
                this.filterLoader = false;
              };
              reader.readAsDataURL(file);
              if (this.btnName == 'Edit Property' && this.postOnUpdate == '') {
                this.updatePricesheet('2');
              } else if (this.btnName == 'Edit Property' && this.postOnUpdate == 'post') {
                this.postPricesheetOnUpdate();
              }
            } else if (this.selectedPriceSheetNum == '3') {
              const file = files[i];
              const fileName = file.name;
              $('#pricecustomFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);
              this.priceSheetFiles3 = [file];
              this.priceSheetuploads3 = [];
              const replacefile = this.priceSheetFiles3[0];
              // Remove '+' from the name
              const newFileName = replacefile.name.replace(/[+]/g, '');
              const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
              this.priceSheetFiles3[0] = updatedFile;
              const reader = new FileReader();
              reader.onload = (event: any) => {
                this.priceSheetuploads3.push(event.target.result);
                this.filterLoader = false;
              };
              reader.readAsDataURL(file);
              if (this.btnName == 'Edit Property' && this.postOnUpdate == '') {
                this.updatePricesheet('3');
              } else if (this.btnName == 'Edit Property' && this.postOnUpdate == 'post') {
                this.postPricesheetOnUpdate();
              }
            } else if (this.selectedPriceSheetNum == '4') {
              const file = files[i];
              const fileName = file.name;
              $('#pricecustomFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);
              this.priceSheetFiles4 = [file];
              this.priceSheetuploads4 = [];
              const replacefile = this.priceSheetFiles4[0];
              // Remove '+' from the name
              const newFileName = replacefile.name.replace(/[+]/g, '');
              const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
              this.priceSheetFiles4[0] = updatedFile;
              const reader = new FileReader();
              reader.onload = (event: any) => {
                this.priceSheetuploads4.push(event.target.result);
                this.filterLoader = false;
              };
              reader.readAsDataURL(file);
              if (this.btnName == 'Edit Property' && this.postOnUpdate == '') {
                this.updatePricesheet('4');
              } else if (this.btnName == 'Edit Property' && this.postOnUpdate == 'post') {
                this.postPricesheetOnUpdate();
              }
            } else if (this.selectedPriceSheetNum == '0') {
              const file = files[i];
              const fileName = file.name;
              $('#pricecustomFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);
              this.priceSheetFiles0 = [file];
              this.priceSheetuploads0 = [];
              const replacefile = this.priceSheetFiles0[0];
              // Remove '+' from the name
              const newFileName = replacefile.name.replace(/[+]/g, '');
              const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
              this.priceSheetFiles0[0] = updatedFile;
              const reader = new FileReader();
              reader.onload = (event: any) => {
                this.priceSheetuploads0.push(event.target.result);
                this.filterLoader = false;
              };
              reader.readAsDataURL(file);
              if (this.btnName == 'Edit Property' && this.postOnUpdate == '') {
                this.updatePricesheet('0');
              } else if (this.btnName == 'Edit Property' && this.postOnUpdate == 'post') {
                this.postPricesheetOnUpdate();
              }
            }
          }
        }
      }
    }
  }

  removePriceSheetImage(i) {
    if (i == '1') {
      $("#pricecustomFile" + i).val('');
      this.priceSheetuploads = [];
      this.priceSheetFiles = [];
      $('.file-label-' + i).html('Choose file ');
    } else if (i == '2') {
      $("#pricecustomFile" + i).val('');
      this.priceSheetuploads2 = [];
      this.priceSheetFiles2 = [];
      $('.file-label-' + i).html('Choose file ');
    } else if (i == '3') {
      $("#pricecustomFile" + i).val('');
      this.priceSheetuploads3 = [];
      this.priceSheetFiles3 = [];
      $('.file-label-' + i).html('Choose file ');
    } else if (i == '4') {
      $("#pricecustomFile" + i).val('');
      this.priceSheetuploads4 = [];
      this.priceSheetFiles4 = [];
      $('.file-label-' + i).html('Choose file ');
    } else if (i == '0') {
      $("#pricecustomFile" + i).val('');
      this.priceSheetuploads0 = [];
      this.priceSheetFiles0 = [];
      $('.file-label-' + i).html('Choose file ');
    }
  }

  videouploads(i: any, event: any) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.filterLoader = true;

    if (files.length == 0) {
      this.filterLoader = false;
    }

    if (files) {
      let allFilesValid = true;

      // Validate file sizes
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > 100000000) {  // 100MB size limit
          allFilesValid = false;
          this.filterLoader = false;
          swal({
            title: 'Video Size Exceeded',
            text: 'Video Size limit is 100MB',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            input.value = '';
            // this.videoFiles = [];
          });
          break;
        } else if (file.type != 'video/mp4') {
          allFilesValid = false;
          this.filterLoader = false;
          swal({
            title: 'Video Type',
            text: 'Only Videos to be Uploaded',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            input.value = '';
            // this.videoFiles = [];
          });
          break;
        }
      }

      // If all files are valid, process them
      if (allFilesValid) {
        for (let i = 0; i < files.length; i++) {
          if (this.selectedVideoNum == '1') {
            const file = files[i];
            const fileName = file.name;
            $('#videocustomFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);

            const replacefile = file;
            // Remove '+' from the name
            const newFileName = replacefile.name.replace(/[+]/g, '');
            const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
            let editedFile = updatedFile;
            // Add the file to the videoFiles array
            this.videoFiles.push(editedFile);

            // Read the video file as a data URL to display as preview
            const reader = new FileReader();
            reader.onload = (event: any) => {
              // Add the video data URL to videouploadsdata
              this.videouploadsdata.push(event.target.result);
              this.filterLoader = false;
            };
            reader.readAsDataURL(file);
            // if (this.btnName == 'Edit Property') {
            //   this.updateVideo();
            // }
          } else if (this.selectedVideoNum == '2') {
            const file = files[i];
            const fileName = file.name;
            $('#videocustomFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);

            const replacefile = file;
            // Remove '+' from the name
            const newFileName = replacefile.name.replace(/[+]/g, '');
            const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
            let editedFile = updatedFile;
            // Add the file to the videoFiles array
            this.videoFiles2.push(editedFile);

            // Read the video file as a data URL to display as preview
            const reader = new FileReader();
            reader.onload = (event: any) => {
              // Add the video data URL to videouploadsdata
              this.videouploadsdata2.push(event.target.result);
              this.filterLoader = false;
            };
            reader.readAsDataURL(file);
            // if (this.btnName == 'Edit Property') {
            //   this.updateVideo();
            // }
          } else if (this.selectedVideoNum == '3') {
            const file = files[i];
            const fileName = file.name;
            $('#videocustomFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);

            const replacefile = file;
            // Remove '+' from the name
            const newFileName = replacefile.name.replace(/[+]/g, '');
            const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
            let editedFile = updatedFile;
            // Add the file to the videoFiles array
            this.videoFiles3.push(editedFile);

            // Read the video file as a data URL to display as preview
            const reader = new FileReader();
            reader.onload = (event: any) => {
              // Add the video data URL to videouploadsdata
              this.videouploadsdata3.push(event.target.result);
              this.filterLoader = false;
            };
            reader.readAsDataURL(file);
            // if (this.btnName == 'Edit Property') {
            //   this.updateVideo();
            // }
          } else if (this.selectedVideoNum == '4') {
            const file = files[i];
            const fileName = file.name;
            $('#videocustomFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);

            const replacefile = file;
            // Remove '+' from the name
            const newFileName = replacefile.name.replace(/[+]/g, '');
            const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
            let editedFile = updatedFile;
            // Add the file to the videoFiles array
            this.videoFiles4.push(editedFile);

            // Read the video file as a data URL to display as preview
            const reader = new FileReader();
            reader.onload = (event: any) => {
              // Add the video data URL to videouploadsdata
              this.videouploadsdata4.push(event.target.result);
              this.filterLoader = false;
            };
            reader.readAsDataURL(file);
            // if (this.btnName == 'Edit Property') {
            //   this.updateVideo();
            // }
          } else if (this.selectedVideoNum == '0') {
            const file = files[i];
            const fileName = file.name;
            $('#videocustomFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);

            const replacefile = file;
            // Remove '+' from the name
            const newFileName = replacefile.name.replace(/[+]/g, '');
            const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
            let editedFile = updatedFile;
            // Add the file to the videoFiles array
            this.videoFiles0.push(editedFile);

            // Read the video file as a data URL to display as preview
            const reader = new FileReader();
            reader.onload = (event: any) => {
              // Add the video data URL to videouploadsdata
              this.videouploadsdata0.push(event.target.result);
              this.filterLoader = false;
            };
            reader.readAsDataURL(file);
            // if (this.btnName == 'Edit Property') {
            //   this.updateVideo();
            // }
          }
        }
      }
    }
  }

  videouploadsOnEdit(i: any, event: any) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.filterLoader = true;

    if (files.length == 0) {
      this.filterLoader = false;
    }

    if (files) {
      let allFilesValid = true;

      // Validate file sizes
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > 100000000) {  // 100MB size limit
          allFilesValid = false;
          this.filterLoader = false;
          swal({
            title: 'Video Size Exceeded',
            text: 'Video Size limit is 100MB',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            input.value = '';
            // this.videoFiles = [];
          });
          break;
        } else if (file.type != 'video/mp4') {
          allFilesValid = false;
          this.filterLoader = false;
          swal({
            title: 'Video Type',
            text: 'Only Videos to be Uploaded',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            input.value = '';
            // this.videoFiles = [];
          });
          break;
        }
      }

      // If all files are valid, process them
      if (allFilesValid) {
        for (let i = 0; i < files.length; i++) {
          if (this.selectedVideoNum == '1') {
            const file = files[i];
            const fileName = file.name;
            $('#videocustomFile1' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);

            const replacefile = file;
            // Remove '+' from the name
            const newFileName = replacefile.name.replace(/[+]/g, '');
            const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
            let editedFile = updatedFile;
            // Add the file to the videoFiles array
            this.videoFilesUpdate.push(editedFile);

            // Read the video file as a data URL to display as preview
            const reader = new FileReader();
            reader.onload = (event: any) => {
              // Add the video data URL to videouploadsdata
              this.videouploadsdataUpdate.push(event.target.result);
              this.filterLoader = false;
            };
            reader.readAsDataURL(file);
            if (this.btnName == 'Edit Property') {
              this.updateVideo();
            }
          } else if (this.selectedVideoNum == '2') {
            const file = files[i];
            const fileName = file.name;
            $('#videocustomFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);

            const replacefile = file;
            // Remove '+' from the name
            const newFileName = replacefile.name.replace(/[+]/g, '');
            const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
            let editedFile = updatedFile;
            // Add the file to the videoFiles array
            this.videoFilesUpdate2.push(editedFile);

            // Read the video file as a data URL to display as preview
            const reader = new FileReader();
            reader.onload = (event: any) => {
              // Add the video data URL to videouploadsdata
              this.videouploadsdataUpdate2.push(event.target.result);
              this.filterLoader = false;
            };
            reader.readAsDataURL(file);
            if (this.btnName == 'Edit Property') {
              this.updateVideo();
            }
          } else if (this.selectedVideoNum == '3') {
            const file = files[i];
            const fileName = file.name;
            $('#videocustomFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);

            const replacefile = file;
            // Remove '+' from the name
            const newFileName = replacefile.name.replace(/[+]/g, '');
            const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
            let editedFile = updatedFile;
            // Add the file to the videoFiles array
            this.videoFilesUpdate3.push(editedFile);

            // Read the video file as a data URL to display as preview
            const reader = new FileReader();
            reader.onload = (event: any) => {
              // Add the video data URL to videouploadsdata
              this.videouploadsdataUpdate3.push(event.target.result);
              this.filterLoader = false;
            };
            reader.readAsDataURL(file);
            if (this.btnName == 'Edit Property') {
              this.updateVideo();
            }
          } else if (this.selectedVideoNum == '4') {
            const file = files[i];
            const fileName = file.name;
            $('#videocustomFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);

            const replacefile = file;
            // Remove '+' from the name
            const newFileName = replacefile.name.replace(/[+]/g, '');
            const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
            let editedFile = updatedFile;
            // Add the file to the videoFiles array
            this.videoFilesUpdate4.push(editedFile);

            // Read the video file as a data URL to display as preview
            const reader = new FileReader();
            reader.onload = (event: any) => {
              // Add the video data URL to videouploadsdata
              this.videouploadsdataUpdate4.push(event.target.result);
              this.filterLoader = false;
            };
            reader.readAsDataURL(file);
            if (this.btnName == 'Edit Property') {
              this.updateVideo();
            }
          } else if (this.selectedVideoNum == '0') {
            const file = files[i];
            const fileName = file.name;
            $('#videocustomFile' + i).siblings(".file-label-" + i).addClass("selected").html(fileName);

            const replacefile = file;
            // Remove '+' from the name
            const newFileName = replacefile.name.replace(/[+]/g, '');
            const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
            let editedFile = updatedFile;
            // Add the file to the videoFiles array
            this.videoFilesUpdate0.push(editedFile);

            // Read the video file as a data URL to display as preview
            const reader = new FileReader();
            reader.onload = (event: any) => {
              // Add the video data URL to videouploadsdata
              this.videouploadsdataUpdate0.push(event.target.result);
              this.filterLoader = false;
            };
            reader.readAsDataURL(file);
            if (this.btnName == 'Edit Property') {
              this.updateVideo();
            }
          }
        }
      }
    }
  }

  // Method to remove video
  removeVideo(type, i) {
    if (type == '1') {
      this.videoFiles.splice(i, 1);
      this.videouploadsdata.splice(i, 1);
      if (this.videoFiles.length == 0) {
        $("#videocustomFile" + i).val('');
        $('.file-label-' + i).html('Choose file ');
      }
    } else if (type == '2') {
      this.videoFiles2.splice(i, 1);
      this.videouploadsdata2.splice(i, 1);
      if (this.videoFiles2.length == 0) {
        $("#videocustomFile" + i).val('');
        $('.file-label-' + i).html('Choose file ');
      }
    } else if (type == '3') {
      this.videoFiles3.splice(i, 1);
      this.videouploadsdata3.splice(i, 1);
      if (this.videoFiles3.length == 0) {
        $("#videocustomFile" + i).val('');
        $('.file-label-' + i).html('Choose file ');
      }
    } else if (type == '4') {
      this.videoFiles4.splice(i, 1);
      this.videouploadsdata4.splice(i, 1);
      if (this.videoFiles4.length == 0) {
        $("#videocustomFile" + i).val('');
        $('.file-label-' + i).html('Choose file ');
      }
    } else if (type == '0') {
      this.videoFiles0.splice(i, 1);
      this.videouploadsdata0.splice(i, 1);
      if (this.videoFiles0.length == 0) {
        $("#videocustomFile" + i).val('');
        $('.file-label-' + i).html('Choose file ');
      }
    }
    // alert(this.uploads.length);
  }

  // Method to upload floor plans
  floorPlansImageuploads(i, event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.sqftArray = [];
    this.sqftArray2 = [];
    this.sqftArray3 = [];
    this.sqftArray4 = [];
    this.sqftArray0 = [];
    this.filterLoader = true;
    if (files.length == 0) {
      this.filterLoader = false;
    }
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]; // Only one file, so we take the first one

        if (file.type !== 'application/pdf' && file.type !== 'image/png' && file.type !== 'image/jpeg') {
          this.filterLoader = false;
          swal({
            title: 'Invalid File Type',
            text: 'Only PDF/PNG/JPEG files are allowed.',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            input.value = '';
            // this.floorFiles = [];
          });
          return;
        } else {
          // Validate the file size
          if (file.size > 10000000) {
            this.filterLoader = false;
            swal({
              title: 'File Size Exceeded',
              text: 'File Size limit is 10MB',
              type: "error",
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              input.value = '';
              // this.floorFiles = [];
              // this.flooruploads = [];
            });
          } else {
            // Push the file to closurefiles and read the file
            if (this.selectedFloorPlanNum == '1') {
              const replacefile = file;
              // Remove '+' from the name
              const newFileName = replacefile.name.replace(/[+]/g, '');
              const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
              let editedFile = updatedFile;
              this.floorFiles.push(editedFile);
              // this.sqftArray = new Array(this.floorFiles.length).fill('');
              let sqftArray;
              if (this.sqftArray.length !== this.floorFiles.length) {
                sqftArray = new Array(this.floorFiles.length).fill('');
              }
              for (let i = 0; i < this.sqftArray.length; i++) {
                if (this.sqftArray[i] !== '') {
                  sqftArray[i] = this.sqftArray[i]
                }
              }
              this.sqftArray = sqftArray;
              if (this.btnName == 'Edit Property') {
                this.sqftArraylength = this.sqftArray.filter(value => value !== undefined && value !== null && value != '').length;
              }

              // this.flooruploads = [];
              const reader = new FileReader();
              reader.onload = (event: any) => {
                this.flooruploads.push(event.target.result);
                this.filterLoader = false;
              };
              reader.readAsDataURL(file);
              $('#floorFile' + i).siblings(".file-label-" + i).addClass("selected").html(file.name);

              // if (this.btnName == 'Edit Property') {
              //   this.updateFloor();
              // }
            } else if (this.selectedFloorPlanNum == '2') {
              const replacefile = file;
              // Remove '+' from the name
              const newFileName = replacefile.name.replace(/[+]/g, '');
              const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
              let editedFile = updatedFile;
              this.floorFiles2.push(editedFile);  // Only keep the new file
              // this.sqftArray2 = new Array(this.floorFiles2.length).fill('');
              let sqftArray2;
              if (this.sqftArray2.length !== this.floorFiles2.length) {
                sqftArray2 = new Array(this.floorFiles2.length).fill('');
              }
              for (let i = 0; i < this.sqftArray2.length; i++) {
                if (this.sqftArray2[i] !== '') {
                  sqftArray2[i] = this.sqftArray2[i]
                }
              }
              this.sqftArray2 = sqftArray2;
              if (this.btnName == 'Edit Property') {
                this.sqftArraylength2 = this.sqftArray2.filter(value => value !== undefined && value !== null && value != '').length;
              }
              // this.flooruploads2 = [];
              const reader = new FileReader();
              reader.onload = (event: any) => {
                this.flooruploads2.push(event.target.result);
                this.filterLoader = false;
              };

              reader.readAsDataURL(file);
              $('#floorFile' + i).siblings(".file-label-" + i).addClass("selected").html(file.name);

              // if (this.btnName == 'Edit Property') {
              //   this.updateFloor();
              // }
            } else if (this.selectedFloorPlanNum == '3') {
              const replacefile = file;
              // Remove '+' from the name
              const newFileName = replacefile.name.replace(/[+]/g, '');
              const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
              let editedFile = updatedFile;
              this.floorFiles3.push(editedFile);  // Only keep the new file
              // this.sqftArray3 = new Array(this.floorFiles3.length).fill('');
              let sqftArray3;
              if (this.sqftArray3.length !== this.floorFiles3.length) {
                sqftArray3 = new Array(this.floorFiles3.length).fill('');
              }
              for (let i = 0; i < this.sqftArray3.length; i++) {
                if (this.sqftArray3[i] !== '') {
                  sqftArray3[i] = this.sqftArray3[i]
                }
              }
              this.sqftArray3 = sqftArray3;
              if (this.btnName == 'Edit Property') {
                this.sqftArraylength3 = this.sqftArray3.filter(value => value !== undefined && value !== null && value != '').length;
              }
              // this.flooruploads3 = [];
              const reader = new FileReader();
              reader.onload = (event: any) => {
                this.flooruploads3.push(event.target.result);
                this.filterLoader = false;
              };
              reader.readAsDataURL(file);
              $('#floorFile' + i).siblings(".file-label-" + i).addClass("selected").html(file.name);

              // if (this.btnName == 'Edit Property') {
              //   this.updateFloor();
              // }
            } else if (this.selectedFloorPlanNum == '4') {
              const replacefile = file;
              // Remove '+' from the name
              const newFileName = replacefile.name.replace(/[+]/g, '');
              const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
              let editedFile = updatedFile;
              this.floorFiles4.push(editedFile);  // Only keep the new file
              let sqftArray4;
              if (this.sqftArray4.length !== this.floorFiles4.length) {
                sqftArray4 = new Array(this.floorFiles4.length).fill('');
              }
              for (let i = 0; i < this.sqftArray4.length; i++) {
                if (this.sqftArray4[i] !== '') {
                  sqftArray4[i] = this.sqftArray4[i]
                }
              }
              this.sqftArray4 = sqftArray4;
              if (this.btnName == 'Edit Property') {
                this.sqftArraylength4 = this.sqftArray4.filter(value => value !== undefined && value !== null && value != '').length;
              }
              // this.flooruploads4 = [];
              const reader = new FileReader();
              reader.onload = (event: any) => {
                this.flooruploads4.push(event.target.result);
                this.filterLoader = false;
              };
              reader.readAsDataURL(file);
              $('#floorFile' + i).siblings(".file-label-" + i).addClass("selected").html(file.name);

              // if (this.btnName == 'Edit Property') {
              //   this.updateFloor();
              // }
            } else if (this.selectedFloorPlanNum == '0') {
              const replacefile = file;
              // Remove '+' from the name
              const newFileName = replacefile.name.replace(/[+]/g, '');
              const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
              let editedFile = updatedFile;
              this.floorFiles0.push(editedFile);  // Only keep the new file
              let sqftArray0;
              if (this.sqftArray0.length !== this.floorFiles0.length) {
                sqftArray0 = new Array(this.floorFiles0.length).fill('');
              }
              for (let i = 0; i < this.sqftArray0.length; i++) {
                if (this.sqftArray0[i] !== '') {
                  sqftArray0[i] = this.sqftArray0[i]
                }
              }
              this.sqftArray0 = sqftArray0;
              if (this.btnName == 'Edit Property') {
                this.sqftArraylength0 = this.sqftArray0.filter(value => value !== undefined && value !== null && value != '').length;
              }
              // this.flooruploads4 = [];
              const reader = new FileReader();
              reader.onload = (event: any) => {
                this.flooruploads0.push(event.target.result);
                this.filterLoader = false;
              };
              reader.readAsDataURL(file);
              $('#floorFile' + i).siblings(".file-label-" + i).addClass("selected").html(file.name);

              // if (this.btnName == 'Edit Property') {
              //   this.updateFloor();
              // }
            }
          }
        }
      }
    }
  }

  // Method to upload floor plans
  floorPlansImageuploadsOnUpdate(i, event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.updateonPostSqrt = [];
    this.updateonPostSqrt2 = [];
    this.updateonPostSqrt3 = [];
    this.updateonPostSqrt4 = [];
    this.updateonPostSqrt0 = [];
    this.filterLoader = true;
    if (files.length == 0) {
      this.filterLoader = false;
    }
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]; // Only one file, so we take the first one

        if (file.type !== 'application/pdf' && file.type !== 'image/png' && file.type !== 'image/jpeg') {
          this.filterLoader = false;
          swal({
            title: 'Invalid File Type',
            text: 'Only PDF/PNG/JPEG files are allowed.',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            input.value = '';
            // this.floorFilesOnUpdate = [];
          });
          return;
        } else {
          // Validate the file size
          if (file.size > 10000000) {
            this.filterLoader = false;
            swal({
              title: 'File Size Exceeded',
              text: 'File Size limit is 10MB',
              type: "error",
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              input.value = '';
              // this.floorFilesOnUpdate = [];
              // this.flooruploads = [];
            });
          } else {
            // Push the file to closurefiles and read the file
            if (this.selectedFloorPlanNum == '1') {
              const replacefile = file;
              // Remove '+' from the name
              const newFileName = replacefile.name.replace(/[+]/g, '');
              const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
              let editedFile = updatedFile;
              this.floorFilesOnUpdate.push(editedFile);
              // this.sqftArray = new Array(this.floorFiles.length).fill('');
              let sqftArray;
              if (this.updateonPostSqrt.length !== this.floorFilesOnUpdate.length) {
                sqftArray = new Array(this.floorFilesOnUpdate.length).fill('');
              }
              for (let i = 0; i < this.updateonPostSqrt.length; i++) {
                if (this.updateonPostSqrt[i] !== '') {
                  sqftArray[i] = this.updateonPostSqrt[i]
                }
              }
              this.updateonPostSqrt = sqftArray;
              if (this.btnName == 'Edit Property') {
                this.sqftArraylength = this.updateonPostSqrt.filter(value => value !== undefined && value !== null && value != '').length;
              }

              // this.flooruploadsOnUpdate = [];
              const reader = new FileReader();
              reader.onload = (event: any) => {
                this.flooruploadsOnUpdate.push(event.target.result);
                this.filterLoader = false;
              };
              reader.readAsDataURL(file);
              $('#floorFile1' + i).siblings(".file-label-" + i).addClass("selected").html(file.name);

              // if (this.btnName == 'Edit Property') {
              //   this.updateFloor();
              // }
            } else if (this.selectedFloorPlanNum == '2') {
              const replacefile = file;
              // Remove '+' from the name
              const newFileName = replacefile.name.replace(/[+]/g, '');
              const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
              let editedFile = updatedFile;
              this.floorFilesOnUpdate2.push(editedFile);  // Only keep the new file
              // this.sqftArray2 = new Array(this.floorFiles2.length).fill('');
              let sqftArray2;
              if (this.updateonPostSqrt2.length !== this.floorFilesOnUpdate2.length) {
                sqftArray2 = new Array(this.floorFilesOnUpdate2.length).fill('');
              }
              for (let i = 0; i < this.updateonPostSqrt2.length; i++) {
                if (this.updateonPostSqrt2[i] !== '') {
                  sqftArray2[i] = this.updateonPostSqrt2[i]
                }
              }
              this.updateonPostSqrt2 = sqftArray2;
              if (this.btnName == 'Edit Property') {
                this.sqftArraylength2 = this.updateonPostSqrt2.filter(value => value !== undefined && value !== null && value != '').length;
              }
              // this.flooruploadsOnUpdate2 = [];
              const reader = new FileReader();
              reader.onload = (event: any) => {
                this.flooruploadsOnUpdate2.push(event.target.result);
                this.filterLoader = false;
              };
              reader.readAsDataURL(file);
              $('#floorFile1' + i).siblings(".file-label-" + i).addClass("selected").html(file.name);

              // if (this.btnName == 'Edit Property') {
              //   this.updateFloor();
              // }
            } else if (this.selectedFloorPlanNum == '3') {
              const replacefile = file;
              // Remove '+' from the name
              const newFileName = replacefile.name.replace(/[+]/g, '');
              const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
              let editedFile = updatedFile;
              this.floorFilesOnUpdate3.push(editedFile);  // Only keep the new file
              // this.sqftArray3 = new Array(this.floorFiles3.length).fill('');
              let sqftArray3;
              if (this.updateonPostSqrt3.length !== this.floorFilesOnUpdate3.length) {
                sqftArray3 = new Array(this.floorFilesOnUpdate3.length).fill('');
              }
              for (let i = 0; i < this.updateonPostSqrt3.length; i++) {
                if (this.updateonPostSqrt3[i] !== '') {
                  sqftArray3[i] = this.updateonPostSqrt3[i]
                }
              }
              this.updateonPostSqrt3 = sqftArray3;
              if (this.btnName == 'Edit Property') {
                this.sqftArraylength3 = this.updateonPostSqrt3.filter(value => value !== undefined && value !== null && value != '').length;
              }
              // this.fflooruploadsOnUpdate3 = [];
              const reader = new FileReader();
              reader.onload = (event: any) => {
                this.flooruploadsOnUpdate3.push(event.target.result);
                this.filterLoader = false;
              };
              reader.readAsDataURL(file);
              $('#floorFile1' + i).siblings(".file-label-" + i).addClass("selected").html(file.name);

              // if (this.btnName == 'Edit Property') {
              //   this.updateFloor();
              // }
            } else if (this.selectedFloorPlanNum == '4') {
              const replacefile = file;
              // Remove '+' from the name
              const newFileName = replacefile.name.replace(/[+]/g, '');
              const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
              let editedFile = updatedFile;
              this.floorFilesOnUpdate4.push(editedFile);  // Only keep the new file
              let sqftArray4;
              if (this.updateonPostSqrt4.length !== this.floorFilesOnUpdate4.length) {
                sqftArray4 = new Array(this.floorFilesOnUpdate4.length).fill('');
              }
              for (let i = 0; i < this.updateonPostSqrt4.length; i++) {
                if (this.updateonPostSqrt4[i] !== '') {
                  sqftArray4[i] = this.updateonPostSqrt4[i]
                }
              }
              this.updateonPostSqrt4 = sqftArray4;
              if (this.btnName == 'Edit Property') {
                this.sqftArraylength4 = this.updateonPostSqrt4.filter(value => value !== undefined && value !== null && value != '').length;
              }
              // this.flooruploadsOnUpdate4 = [];
              const reader = new FileReader();
              reader.onload = (event: any) => {
                this.flooruploadsOnUpdate4.push(event.target.result);
                this.filterLoader = false;
              };
              reader.readAsDataURL(file);
              $('#floorFile1' + i).siblings(".file-label-" + i).addClass("selected").html(file.name);

              // if (this.btnName == 'Edit Property') {
              //   this.updateFloor();
              // }
            } else if (this.selectedFloorPlanNum == '0') {
              const replacefile = file;
              // Remove '+' from the name
              const newFileName = replacefile.name.replace(/[+]/g, '');
              const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
              let editedFile = updatedFile;
              this.floorFilesOnUpdate0.push(editedFile);  // Only keep the new file
              let sqftArray0;
              if (this.updateonPostSqrt0.length !== this.floorFilesOnUpdate0.length) {
                sqftArray0 = new Array(this.floorFilesOnUpdate0.length).fill('');
              }
              for (let i = 0; i < this.updateonPostSqrt0.length; i++) {
                if (this.updateonPostSqrt0[i] !== '') {
                  sqftArray0[i] = this.updateonPostSqrt0[i]
                }
              }
              this.updateonPostSqrt0 = sqftArray0;
              if (this.btnName == 'Edit Property') {
                this.sqftArraylength0 = this.updateonPostSqrt0.filter(value => value !== undefined && value !== null && value != '').length;
              }
              // this.flooruploadsOnUpdate4 = [];
              const reader = new FileReader();
              reader.onload = (event: any) => {
                this.flooruploadsOnUpdate0.push(event.target.result);
                this.filterLoader = false;
              };
              reader.readAsDataURL(file);
              $('#floorFile1' + i).siblings(".file-label-" + i).addClass("selected").html(file.name);

              // if (this.btnName == 'Edit Property') {
              //   this.updateFloor();
              // }
            }
          }
        }
      }
    }
  }

  // Method to remove floor plan
  removeFloorPlans(type, i) {
    if (type == '1') {
      this.flooruploads.splice(i, 1);
      this.floorFiles.splice(i, 1);
      if (this.flooruploads.length == 0) {
        $("#floorFile" + i).val('');
        $('.file-label-' + i).html('Choose file ');
      }
    } else if (type == '2') {
      this.flooruploads2 = [];
      this.floorFiles2 = [];
      if (this.flooruploads2.length == 0) {
        $("#floorFile" + i).val('');
        $('.file-label-' + i).html('Choose file ');
      }
    } else if (type == '3') {
      this.flooruploads3 = [];
      this.floorFiles3 = [];
      if (this.flooruploads3.length == 0) {
        $("#floorFile" + i).val('');
        $('.file-label-' + i).html('Choose file ');
      }
    } else if (type == '4') {
      this.flooruploads4 = [];
      this.floorFiles4 = [];
      if (this.flooruploads4.length == 0) {
        $("#floorFile" + i).val('');
        $('.file-label-' + i).html('Choose file ');
      }
    } else if (type == '0') {
      this.flooruploads0.splice(i, 1);
      this.floorFiles0.splice(i, 1);
      if (this.flooruploads0.length == 0) {
        $("#floorFile" + i).val('');
        $('.file-label-' + i).html('Choose file ');
      }
    }
    // alert(this.uploads.length);
  }

  // Method to remove floor plan on edit
  removeFloorPlansonEdit(type, i) {
    if (type == '1') {
      this.flooruploadsOnUpdate.splice(i, 1);
      this.floorFilesOnUpdate.splice(i, 1);
      if (this.flooruploadsOnUpdate.length == 0) {
        $("#floorFile1" + i).val('');
        $('.file-label-' + i).html('Choose file ');
      }
    } else if (type == '2') {
      this.flooruploadsOnUpdate2.splice(i, 1);
      this.floorFilesOnUpdate2.splice(i, 1);
      if (this.flooruploadsOnUpdate2.length == 0) {
        $("#floorFile1" + i).val('');
        $('.file-label-' + i).html('Choose file ');
      }
    } else if (type == '3') {
      this.flooruploadsOnUpdate3.splice(i, 1);
      this.floorFilesOnUpdate3.splice(i, 1);
      if (this.flooruploadsOnUpdate3.length == 0) {
        $("#floorFile1" + i).val('');
        $('.file-label-' + i).html('Choose file ');
      }
    } else if (type == '4') {
      this.flooruploadsOnUpdate4.splice(i, 1);
      this.floorFilesOnUpdate4.splice(i, 1);
      if (this.flooruploadsOnUpdate4.length == 0) {
        $("#floorFile1" + i).val('');
        $('.file-label-' + i).html('Choose file ');
      }
    } else if (type == '0') {
      this.flooruploadsOnUpdate0.splice(i, 1);
      this.floorFilesOnUpdate0.splice(i, 1);
      if (this.flooruploadsOnUpdate0.length == 0) {
        $("#floorFile1" + i).val('');
        $('.file-label-' + i).html('Choose file ');
      }
    }
    // alert(this.uploads.length);
  }

  addProperty() {
    if (this.selectedProperties == '' || this.selectedProperties == undefined || this.selectedProperties == null || this.selectedProperties.length == 0) {
      swal({
        title: 'Select the Property',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    }

    // if (this.projectInfo == "" || this.projectInfo == undefined || this.projectInfo == null) {
    //   swal({
    //     title: 'Project Info',
    //     text: 'Project Info is not provided',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }

    // if ($("#customFile" + '0').val() == "" || $("#customFile" + '0').val() == undefined || $("#customFile" + '0').val() == null) {
    //   swal({
    //     title: 'No Files Uploaded for Brochure',
    //     text: 'Upload atleast one file',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }

    // if ($("#pricecustomFile" + '0').val() == "" || $("#pricecustomFile" + '0').val() == undefined || $("#pricecustomFile" + '0').val() == null) {
    //   swal({
    //     title: 'No Files Uploaded for Price Sheet',
    //     text: 'Upload atleast one file',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }

    // if ($("#videocustomFile" + 0).val() == "") {
    //   swal({
    //     title: 'No Video Uploaded',
    //     text: 'Upload atleast one Video',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }

    // if (this.floorFiles && this.floorFiles.length > 0 && this.floorFiles.length != this.sqftArraylength) {
    //   swal({
    //     title: 'Floor Plans SQFT',
    //     text: 'Please Update all the Floor Plans SQFT for 1BHK',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }

    // if (this.floorFiles2 && this.floorFiles2.length > 0 && this.floorFiles2.length != this.sqftArraylength2) {
    //   swal({
    //     title: 'Floor Plans SQFT',
    //     text: 'Please Update all the Floor Plans SQFT for 2BHK',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }

    // if (this.floorFiles3 && this.floorFiles3.length > 0 && this.floorFiles3.length != this.sqftArraylength3) {
    //   swal({
    //     title: 'Floor Plans SQFT',
    //     text: 'Please Update all the Floor Plans SQFT for 3BHK',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }

    // if (this.floorFiles4 && this.floorFiles4.length > 0 && this.floorFiles4.length != this.sqftArraylength4) {
    //   swal({
    //     title: 'Floor Plans SQFT',
    //     text: 'Please Update all the Floor Plans SQFT for 4BHK',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }

    // if (this.floorFiles0 && this.floorFiles0.length > 0 && this.floorFiles0.length != this.sqftArraylength0) {
    //   swal({
    //     title: 'Floor Plans SQFT',
    //     text: 'Please Update all the Floor Plans SQFT for Common',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }

    this.filterLoader = true;

    const formData = new FormData();
    formData.append('projectid', this.selectedProperties);
    formData.append('projectinfo', this.projectInfo);

    if (this.brochureFiles && this.brochureFiles.length > 0) {
      formData.append('brochure', this.brochureFiles[0]);
    } else {
      formData.append('brochure', '');
    }

    if (this.priceSheetFiles && this.priceSheetFiles.length > 0) {
      formData.append('ps1bhk', this.priceSheetFiles[0]);
    } else {
      formData.append('ps1bhk', '');
    }

    if (this.priceSheetFiles2 && this.priceSheetFiles2.length > 0) {
      formData.append('ps2bhk', this.priceSheetFiles2[0]);
    } else {
      formData.append('ps2bhk', '');
    }

    if (this.priceSheetFiles3 && this.priceSheetFiles3.length > 0) {
      formData.append('ps3bhk', this.priceSheetFiles3[0]);
    } else {
      formData.append('ps3bhk', '');
    }

    if (this.priceSheetFiles4 && this.priceSheetFiles4.length > 0) {
      formData.append('ps4bhk', this.priceSheetFiles4[0]);
    } else {
      formData.append('ps4bhk', '');
    }

    if (this.priceSheetFiles0 && this.priceSheetFiles0.length > 0) {
      formData.append('ps0bhk', this.priceSheetFiles0[0]);
    } else {
      formData.append('ps0bhk', '');
    }

    if (this.floorFiles && this.floorFiles.length > 0) {
      for (let k = 0; k < this.floorFiles.length; k++) {
        formData.append('fp1bhk[]', this.floorFiles[k]);
      }
      formData.append('fp1bhksqft', this.sqftArray.join(','));
    } else {
      formData.append('fp1bhk[]', '');
      formData.append('fp1bhksqft', '');
    }

    if (this.floorFiles2 && this.floorFiles2.length > 0) {
      for (let k = 0; k < this.floorFiles2.length; k++) {
        formData.append('fp2bhk[]', this.floorFiles2[k]);
      }
      formData.append('fp2bhksqft', this.sqftArray2.join(','));
    } else {
      formData.append('fp2bhk[]', '');
      formData.append('fp2bhksqft', '');
    }

    if (this.floorFiles3 && this.floorFiles3.length > 0) {
      for (let k = 0; k < this.floorFiles3.length; k++) {
        formData.append('fp3bhk[]', this.floorFiles3[k]);
      }
      formData.append('fp3bhksqft', this.sqftArray3.join(','));
    } else {
      formData.append('fp3bhk[]', '');
      formData.append('fp3bhksqft', '');
    }

    if (this.floorFiles4 && this.floorFiles4.length > 0) {
      for (let k = 0; k < this.floorFiles4.length; k++) {
        formData.append('fp4bhk[]', this.floorFiles4[k]);
      }
      formData.append('fp4bhksqft', this.sqftArray4.join(','));
    } else {
      formData.append('fp4bhk[]', '');
      formData.append('fp4bhksqft', '');
    }

    if (this.floorFiles0 && this.floorFiles0.length > 0) {
      for (let k = 0; k < this.floorFiles0.length; k++) {
        formData.append('fp0bhk[]', this.floorFiles0[k]);
      }
      formData.append('fp0bhksqft', this.sqftArray0.join(','));
    } else {
      formData.append('fp0bhk[]', '');
      formData.append('fp0bhksqft', '');
    }

    if (this.videoFiles && this.videoFiles.length > 0) {
      for (let k = 0; k < this.videoFiles.length; k++) {
        formData.append('pv1bhk[]', this.videoFiles[k]);
      }
    } else {
      formData.append('pv1bhk[]', '');
    }

    if (this.videoFiles2 && this.videoFiles2.length > 0) {
      for (let k = 0; k < this.videoFiles2.length; k++) {
        formData.append('pv2bhk[]', this.videoFiles2[k]);
      }
    } else {
      formData.append('pv2bhk[]', '');
    }

    if (this.videoFiles3 && this.videoFiles3.length > 0) {
      for (let k = 0; k < this.videoFiles3.length; k++) {
        formData.append('pv3bhk[]', this.videoFiles3[k]);
      }
    } else {
      formData.append('pv3bhk[]', '');
    }

    if (this.videoFiles4 && this.videoFiles4.length > 0) {
      for (let k = 0; k < this.videoFiles4.length; k++) {
        formData.append('pv4bhk[]', this.videoFiles4[k]);
      }
    } else {
      formData.append('pv4bhk[]', '');
    }

    if (this.videoFiles0 && this.videoFiles0.length > 0) {
      for (let k = 0; k < this.videoFiles0.length; k++) {
        formData.append('pv0bhk[]', this.videoFiles0[k]);
      }
    } else {
      formData.append('pv0bhk[]', '');
    }


    this._mandateService.createPricingList(formData).subscribe((resp) => {
      swal({
        title: 'Property Added Successfully',
        type: 'success',
        timer: 2000,
        showConfirmButton: false
      })
      this.filterLoader = false;
      $('.close').click();
      let element2 = document.getElementById('dashboard_dynamic_links_5');
      if (element2) {
        element2.parentNode.removeChild(element2);
      }
      this.getAllProperties();
    })
  }

  selectedType(prop, type) {
    this.selectedOpt = prop;
    if (type == 'Brochure') {
      const fileUrl = 'https://lead247.in/images/brochure/' + prop.Brochure;
      window.open(fileUrl, '_blank');
    } else if (type == 'PriceSheet') {
      // const fileUrl = 'https://lead247.in/images/pricesheet/' + prop.Pricesheet;
      // window.open(fileUrl, '_blank');
    } else if (type == 'floorplan') {
      // const fileUrl = 'https://lead247.in/images/floorplans/' + prop.Floorplan;
      // window.open(fileUrl, '_blank');
    }
  }

  selectedContentType(type) {
    if (type == 'brochure') {

      const fileUrl = 'https://lead247.in/images/brochure/' + type + '';
      const message = `Hey, check out this price sheet: ${fileUrl}`;
      // Encode the message to ensure it's properly formatted for URLs
      const encodedMessage = encodeURIComponent(message);
      const whatsAppUrl = `https://wa.me/?text=${encodedMessage}`;
      // Redirect to the WhatsApp sharing page
      window.open(whatsAppUrl, '_blank');

    } else if (type == 'property') {
      const message = `Hey, check out this price sheet: `;
      // Encode the message to ensure it's properly formatted for URLs
      const encodedMessage = encodeURIComponent(message);
      const whatsAppUrl = `https://wa.me/?text=${encodedMessage}`;
      // Redirect to the WhatsApp sharing page
      window.open(whatsAppUrl, '_blank');

    } else if (type == 'price') {

      const fileUrl = 'https://lead247.in/images/pricesheet/' + type + '';
      const message = `Hey, check out this price sheet: ${fileUrl}`;
      // Encode the message to ensure it's properly formatted for URLs
      const encodedMessage = encodeURIComponent(message);
      const whatsAppUrl = `https://wa.me/?text=${encodedMessage}`;
      // Redirect to the WhatsApp sharing page
      window.open(whatsAppUrl, '_blank');

    } else if (type == 'video') {

      const fileUrl = 'https://lead247.in/images/videos/' + type + '';
      const message = `Hey, check out this price sheet: ${fileUrl}`;
      // Encode the message to ensure it's properly formatted for URLs
      const encodedMessage = encodeURIComponent(message);
      const whatsAppUrl = `https://wa.me/?text=${encodedMessage}`;
      // Redirect to the WhatsApp sharing page
      window.open(whatsAppUrl, '_blank');

    } else if (type == 'all') {

    }
  }

  downloadBrochure(data) {
    const link = this.renderer.createElement('a');
    link.setAttribute('target', '_self');
    link.setAttribute('href', 'https://lead247.in/images/brochure/' + data);
    link.setAttribute('download', data);
    link.click();
    link.remove();
  }

  downloadPricesheet(data) {
    const link = this.renderer.createElement('a');
    link.setAttribute('target', '_self');
    link.setAttribute('href', 'https://lead247.in/images/pricesheet/' + data);
    link.setAttribute('download', data);
    link.click();
    link.remove();
  }

  downloadVideo(data) {
    const link = this.renderer.createElement('a');
    link.setAttribute('target', '_self');
    link.setAttribute('href', 'https://lead247.in/images/videos/' + data.propdetails_video);
    link.setAttribute('download', data.propdetails_video);
    link.click();
    link.remove();
    // for testing use this if its in localhost
    // link.setAttribute('href', '../../../../assets/images/' + vid.propdetails_video);
  }

  downloadFloorPlan(data) {
    const link = this.renderer.createElement('a');
    link.setAttribute('target', '_self');
    link.setAttribute('href', 'https://lead247.in/images/floorplans/' + data.floorplan_image);
    link.setAttribute('download', data);
    link.click();
    link.remove();
  }

  downloadAllFiles(prop) {
    if (prop.videos.length > 0) {
      this.downloadVideo(prop.videos);
    }
    if (prop.Brochure != null) {
      this.downloadBrochure(prop.Brochure);
    }
    if (prop.Pricesheet != null) {
      this.downloadPricesheet(prop.Pricesheet);
    }
  }

  @ViewChild('propInfoElement') propInfoElement: ElementRef;
  copyToClipboard(inputElement) {
    const propertyContent = this.propInfoElement.nativeElement.innerHTML;

    // Create a temporary element to hold the content
    const tempElement = document.createElement('div');
    tempElement.innerHTML = propertyContent;
    // Append the element to the body
    document.body.appendChild(tempElement);
    // Create a range and select the content
    const range = document.createRange();
    range.selectNodeContents(tempElement);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    // Execute the copy command
    try {
      document.execCommand('copy');
      this.showCopiedBtn = true;
    } catch (err) {
      console.log('Error copying text:', err);
    }
    // Clean up the temporary element
    document.body.removeChild(tempElement);
  }

  propertycloseDetailModal() {
    this.showCopiedBtn = false;
  }

  addProp() {
    setTimeout(() => {
      $('#builder_Dropdown').dropdown('clear');
      $('#property_Dropdown').dropdown('clear');
      this.projectInfo = '';
    }, 0)
    this.selectedProperties = []
    this.projectInfo = '';
    this.uploads = [];
    this.priceSheetuploads = [];
    this.videouploadsdata = [];
    this.postOnUpdate = '';
    this.priceSheetFiles = [];
    this.priceSheetFiles0 = [];
    this.priceSheetFiles2 = [];
    this.priceSheetFiles3 = [];
    this.priceSheetFiles4 = [];
    this.videouploadsdata = [];
    this.videoFiles = [];
    this.videouploadsdata0 = [];
    this.videoFiles0 = [];
    this.videouploadsdata2 = [];
    this.videoFiles2 = [];
    this.videouploadsdata3 = [];
    this.videoFiles3 = [];
    this.videouploadsdata4 = [];
    this.videoFiles4 = [];
    this.videouploadsdataUpdate = [];
    this.videoFilesUpdate = [];
    this.videouploadsdataUpdate0 = [];
    this.videoFilesUpdate0 = [];
    this.videouploadsdataUpdate2 = [];
    this.videoFilesUpdate2 = [];
    this.videouploadsdataUpdate3 = [];
    this.videoFilesUpdate3 = [];
    this.videouploadsdataUpdate4 = [];
    this.videoFilesUpdate4 = [];
    this.floorFiles = [];
    this.floorFiles0 = [];
    this.floorFiles2 = [];
    this.floorFiles3 = [];
    this.floorFiles4 = [];
    this.sqftArray = [];
    this.sqftArray0 = [];
    this.sqftArray2 = [];
    this.sqftArray3 = [];
    this.sqftArray4 = [];
    this.selectedFloorPlanNum = '';
    this.selectedPriceSheetNum = '';
    this.selectedVideoNum = '';
    this.selectedEditProp = null;
    this.getTinyMceCode();
  }

  addVideo(num) {
    this.selectedVideoNum = num;
  }

  //here we get property detail on clicking edit
  editProp(prop) {
    this.filterLoader = true;
    this.projectInfo = '';
    this.uploads = [];
    this.priceSheetuploads = [];
    this.videouploadsdata = [];
    this.videoFiles = [];
    this.videouploadsdata0 = [];
    this.videoFiles0 = [];
    this.videouploadsdata2 = [];
    this.videoFiles2 = [];
    this.videouploadsdata3 = [];
    this.videoFiles3 = [];
    this.videouploadsdata4 = [];
    this.videoFiles4 = [];
    this.videouploadsdataUpdate = [];
    this.videoFilesUpdate = [];
    this.videouploadsdataUpdate0 = [];
    this.videoFilesUpdate0 = [];
    this.videouploadsdataUpdate2 = [];
    this.videoFilesUpdate2 = [];
    this.videouploadsdataUpdate3 = [];
    this.videoFilesUpdate3 = [];
    this.videouploadsdataUpdate4 = [];
    this.videoFilesUpdate4 = [];
    this.postOnUpdate = '';
    this.priceSheetFiles = [];
    this.priceSheetFiles0 = [];
    this.priceSheetFiles2 = [];
    this.priceSheetFiles3 = [];
    this.priceSheetFiles4 = [];
    this.floorFiles = [];
    this.floorFiles0 = [];
    this.floorFiles2 = [];
    this.floorFiles3 = [];
    this.floorFiles4 = [];
    this.sqftArray = [];
    this.sqftArray0 = [];
    this.sqftArray2 = [];
    this.sqftArray3 = [];
    this.sqftArray4 = [];
    this.selectedFloorPlanNum = '';
    this.selectedPriceSheetNum = '';
    this.selectedVideoNum = '';
    this.selectedEditProp = prop;
    this.btnName = 'Edit Property';
    this.selectedBuilders = prop.BuilderId;
    this.builderid = prop.BuilderId;
    this.selectedProperties = prop.PropId;

    if (prop.videos) {
      if (prop.videos[0]) {
        this.selectedVideoNum = prop.videos[0].bhkId;
      }
      prop.videos.forEach((pv) => {
        if (pv.bhkId == '1') {
          this.videoFiles.push(pv);
        } else if (pv.bhkId == '2') {
          this.videoFiles2.push(pv);
        } else if (pv.bhkId == '3') {
          this.videoFiles3.push(pv);
        } else if (pv.bhkId == '4') {
          this.videoFiles4.push(pv);
        } else if (pv.bhkId == '0') {
          this.videoFiles0.push(pv);
        }
      })
    }

    if (prop.Pricesheets) {
      prop.Pricesheets.forEach((ps) => {
        if (ps.bhkId == '1') {
          this.priceSheetFiles.push(ps);
        } else if (ps.bhkId == '2') {
          this.priceSheetFiles2.push(ps);
        } else if (ps.bhkId == '3') {
          this.priceSheetFiles3.push(ps);
        } else if (ps.bhkId == '4') {
          this.priceSheetFiles4.push(ps);
        } else if (ps.bhkId == '0') {
          this.priceSheetFiles0.push(ps);
        }
      })
    }

    if (prop.Floorplans) {
      if (prop.Floorplans[0]) {
        this.selectedFloorPlanNum = prop.Floorplans[0].bhkId;
      }
      prop.Floorplans.forEach((ps) => {
        if (ps.bhkId == '1') {
          this.floorFiles.push(ps);
          this.sqftArray.push(ps.sqft);
          this.sqftArraylength = this.sqftArray.filter(value => value !== undefined && value !== null && value != '').length;
        } else if (ps.bhkId == '2') {
          this.floorFiles2.push(ps);
          this.sqftArray2.push(ps.sqft);
          this.sqftArraylength2 = this.sqftArray2.filter(value => value !== undefined && value !== null && value != '').length;
        } else if (ps.bhkId == '3') {
          this.floorFiles3.push(ps);
          this.sqftArray3.push(ps.sqft);
          this.sqftArraylength3 = this.sqftArray3.filter(value => value !== undefined && value !== null && value != '').length;
        } else if (ps.bhkId == '4') {
          this.floorFiles4.push(ps);
          this.sqftArray4.push(ps.sqft);
          this.sqftArraylength4 = this.sqftArray4.filter(value => value !== undefined && value !== null && value != '').length;
        } else if (ps.bhkId == '0') {
          this.floorFiles0.push(ps);
          this.sqftArray0.push(ps.sqft);
          this.sqftArraylength0 = this.sqftArray0.filter(value => value !== undefined && value !== null && value != '').length;
        }
      })
    }
    this.filterLoader = false;
    this.builderchange('')
    setTimeout(() => {
      this.getTinyMceCode();
      this.projectInfo = prop.PropInfo;
    }, 500)
    setTimeout(() => {
      this.filterLoader = false;
      this.selectedProperties = prop.PropId;
      // this.projectInfo = prop.PropInfo;
      this.uploads.push(prop.Brochure);
      // this.videouploadsdata = prop.videos;
    }, 1000)
  }

  //edit Brochure
  editBrochure(i) {
    // Manually trigger the file input click to open the file dialog
    setTimeout(() => {
      const fileInput = document.getElementById('customFile0') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
      this.btnName = 'Edit Property';
    }, 0)

  }

  //edit pricesheet
  editPriceSheet(i) {
    // Manually trigger the file input click to open the file dialog
    setTimeout(() => {
      const fileInput = document.getElementById('pricecustomFile0') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
      this.btnName = 'Edit Property';
    }, 0)

  }

  //edit Floor Plan
  editFloorPlan(i) {
    // Manually trigger the file input click to open the file dialog
    setTimeout(() => {
      const fileInput = document.getElementById('floorFile') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
      this.btnName = 'Edit Property';
    }, 0)
  }

  //Here on clicking the edit property the video is loaded using this method
  getVideoUrl(video) {
    return 'https://lead247.in/images/videos/' + video.propdetails_video;
  }

  getPriceSheetUrl(price) {
    const url = 'https://lead247.in/images/pricesheet/' + price.propdetails_pricesheet;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  viewPriceSheet(price) {
    const fileUrl = 'https://lead247.in/images/pricesheet/' + price.propdetails_pricesheet;
    window.open(fileUrl, '_blank');
  }

  getfloorplansUrl(floor) {
    const url = 'https://lead247.in/images/floorplans/' + floor.floorplan_image;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  viewVideo(i, video) {
    const fileURL = URL.createObjectURL(video);
    window.open(fileURL, '_blank');
  }

  viewVideoOnEdit(i, video,num) {
    const fileUrl = 'https://lead247.in/images/videos/' + video.propdetails_video;
    window.open(fileUrl, '_blank');
  }

  viewFloorPlan(i, pf) {
    const fileURL = URL.createObjectURL(pf);
    window.open(fileURL, '_blank');
  }

  addpriceSheet(num) {
    this.selectedPriceSheetNum = num;
    // Manually trigger the file input click to open the file dialog
    setTimeout(() => {
      const fileInput = document.getElementById('pricecustomFile0') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }, 0)
  }

  onEditPostpriceSheet(num, type) {
    this.selectedPriceSheetNum = num;
    setTimeout(() => {
      const fileInput = document.getElementById('pricecustomFile0') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
      this.postOnUpdate = type;
    }, 0)
  }

  editpriceSheet(num, price) {
    this.selectedPriceSheetNum = num;
    this.selectedEditPriceSheet = price;
    // Manually trigger the file input click to open the file dialog
    setTimeout(() => {
      const fileInput = document.getElementById('pricecustomFile0') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
      this.btnName = 'Edit Property';
    }, 0)
  }

  addfloorplan(num) {
    this.selectedFloorPlanNum = num;
    // // Manually trigger the file input click to open the file dialog
    // setTimeout(() => {
    //   const fileInput = document.getElementById('floorFile0') as HTMLInputElement;
    //   if (fileInput) {
    //     fileInput.click();
    //   }
    // }, 0)
  }

  postPricesheetOnUpdate() {
    const formData = new FormData();
    formData.append('detailsId', this.selectedEditProp.detailsId)
    formData.append('projectid', this.selectedEditProp.PropId)
    formData.append('psbhkId', this.selectedPriceSheetNum)
    if (this.selectedPriceSheetNum == '1') {
      formData.append('ps1bhk', this.priceSheetFiles[0]);
    } else if (this.selectedPriceSheetNum == '2') {
      formData.append('ps2bhk', this.priceSheetFiles2[0]);
    } else if (this.selectedPriceSheetNum == '3') {
      formData.append('ps3bhk', this.priceSheetFiles3[0]);
    } else if (this.selectedPriceSheetNum == '4') {
      formData.append('ps4bhk', this.priceSheetFiles4[0]);
    } else if (this.selectedPriceSheetNum == '0') {
      formData.append('ps0bhk', this.priceSheetFiles0[0]);
    }

    this.filterLoader = true;
    this._mandateService.postPriceSheetOnUpdate(formData).subscribe((resp) => {
      this.postOnUpdate = '';
      this.filterLoader = false;
      this.getAllProperties();
    })
  }

  viewFloorPlanOnEdit(path) {
    const fileUrl = 'https://lead247.in/images/floorplans/' + path.floorplan_image;
    window.open(fileUrl, '_blank');
  }

  enterSqft(i, event) {
    if (this.selectedFloorPlanNum == '1') {
      const sqftValue = event.target.value;
      this.sqftArray[i] = sqftValue;
      if (this.sqftArray) {
        this.sqftArraylength = this.sqftArray.filter(value => value !== undefined && value !== null && value != '').length;
      }
    } else if (this.selectedFloorPlanNum == '2') {
      const sqftValue2 = event.target.value;
      this.sqftArray2[i] = sqftValue2;
      if (this.sqftArray2) {
        this.sqftArraylength2 = this.sqftArray2.filter(value => value !== undefined && value !== null && value != '').length;
      }
    } else if (this.selectedFloorPlanNum == '3') {
      const sqftValue3 = event.target.value;
      this.sqftArray3[i] = sqftValue3;
      if (this.sqftArray3) {
        this.sqftArraylength3 = this.sqftArray3.filter(value => value !== undefined && value !== null && value != '').length;
      }
    } else if (this.selectedFloorPlanNum == '4') {
      const sqftValue4 = event.target.value;
      this.sqftArray4[i] = sqftValue4;
      if (this.sqftArray4) {
        this.sqftArraylength4 = this.sqftArray4.filter(value => value !== undefined && value !== null && value != '').length;
      }
    } else if (this.selectedFloorPlanNum == '0') {
      const sqftValue0 = event.target.value;
      this.sqftArray0[i] = sqftValue0;
      if (this.sqftArray0) {
        this.sqftArraylength0 = this.sqftArray0.filter(value => value !== undefined && value !== null && value != '').length;
      }
    }

  }

  //used on edit floor plan 
  enterSqftonFloorUpdate(i, event) {
    if (this.selectedFloorPlanNum == '1') {
      const sqftValue = event.target.value;
      this.updateonPostSqrt[i] = sqftValue;
      if (this.updateonPostSqrt) {
        this.sqftArraylength = this.updateonPostSqrt.filter(value => value !== undefined && value !== null && value != '').length;
      }
    } else if (this.selectedFloorPlanNum == '2') {
      const sqftValue2 = event.target.value;
      this.updateonPostSqrt2[i] = sqftValue2;
      if (this.updateonPostSqrt2) {
        this.sqftArraylength2 = this.updateonPostSqrt2.filter(value => value !== undefined && value !== null && value != '').length;
      }
    } else if (this.selectedFloorPlanNum == '3') {
      const sqftValue3 = event.target.value;
      this.updateonPostSqrt3[i] = sqftValue3;
      if (this.updateonPostSqrt3) {
        this.sqftArraylength3 = this.updateonPostSqrt3.filter(value => value !== undefined && value !== null && value != '').length;
      }
    } else if (this.selectedFloorPlanNum == '4') {
      const sqftValue4 = event.target.value;
      this.updateonPostSqrt4[i] = sqftValue4;
      if (this.updateonPostSqrt4) {
        this.sqftArraylength4 = this.updateonPostSqrt4.filter(value => value !== undefined && value !== null && value != '').length;
      }
    } else if (this.selectedFloorPlanNum == '0') {
      const sqftValue0 = event.target.value;
      this.updateonPostSqrt0[i] = sqftValue0;
      if (this.updateonPostSqrt0) {
        this.sqftArraylength0 = this.updateonPostSqrt0.filter(value => value !== undefined && value !== null && value != '').length;
      }
    }
  }

  //update Brochure
  updateBrochure() {
    const formData = new FormData();
    formData.append('detailsId', this.selectedEditProp.detailsId);
    formData.append('projectid', this.selectedEditProp.PropId);
    if (this.brochureFiles && this.brochureFiles.length > 0) {
      formData.append('brochure', this.brochureFiles[0]);
    } else {
      formData.append('brochure', '');
    }
    this.filterLoader = true;
    this._mandateService.updateBrochure(formData).subscribe((resp) => {
      this.filterLoader = false;
      swal({
        text: 'Brochure Updated Successfully',
        type: 'success',
        timer: 1000,
        showConfirmButton: false
      })
      this.getAllProperties();
    })
  }

  //update price sheet
  updatePricesheet(num) {
    const formData = new FormData();
    formData.append('detailsId', this.selectedEditProp.detailsId);
    formData.append('projectid', this.selectedEditProp.PropId);
    formData.append('psIdpk', this.selectedEditPriceSheet.PS_IDPK);
    formData.append('psbhkId', this.selectedEditPriceSheet.bhkId);
    if (this.priceSheetFiles && this.priceSheetFiles.length > 0 && num == '1') {
      formData.append('ps1bhk', this.priceSheetFiles[0]);
    } else {
      formData.append('ps1bhk', '');
    }
    if (this.priceSheetFiles2 && this.priceSheetFiles2.length > 0 && num == '2') {
      formData.append('ps2bhk', this.priceSheetFiles2[0]);
    } else {
      formData.append('ps2bhk', '');
    }
    if (this.priceSheetFiles3 && this.priceSheetFiles3.length > 0 && num == '3') {
      formData.append('ps3bhk', this.priceSheetFiles3[0]);
    } else {
      formData.append('ps3bhk', '');
    }
    if (this.priceSheetFiles4 && this.priceSheetFiles4.length > 0 && num == '4') {
      formData.append('ps4bhk', this.priceSheetFiles4[0]);
    } else {
      formData.append('ps4bhk', '');
    }
    if (this.priceSheetFiles0 && this.priceSheetFiles0.length > 0 && num == '0') {
      formData.append('ps0bhk', this.priceSheetFiles0[0]);
    } else {
      formData.append('ps0bhk', '');
    }
    this.filterLoader = true;
    this._mandateService.updatePriceSheet(formData).subscribe((resp) => {
      this.filterLoader = false;
      swal({
        text: 'Price Sheet Updated Successfully',
        type: 'success',
        timer: 1000,
        showConfirmButton: false
      })
      this.getAllProperties();
    })
  }

  //update video
  updateVideo() {
    const formData = new FormData();
    formData.append('detailsId', this.selectedEditProp.detailsId);
    formData.append('projectid', this.selectedEditProp.PropId);
    if (this.videoFilesUpdate && this.videoFilesUpdate.length > 0 && this.selectedVideoNum == '1') {
      for (let k = 0; k < this.videoFilesUpdate.length; k++) {
        formData.append('pv1bhk[]', this.videoFilesUpdate[k]);
      }
      formData.append('pvbhkId', '1');
    } else {
      formData.append('pv1bhk[]', '');
    }

    if (this.videoFilesUpdate2 && this.videoFilesUpdate2.length > 0 && this.selectedVideoNum == '2') {
      for (let k = 0; k < this.videoFilesUpdate2.length; k++) {
        formData.append('pv2bhk[]', this.videoFilesUpdate2[k]);
      }
      formData.append('pvbhkId', '2');
    } else {
      formData.append('pv2bhk[]', '');
    }

    if (this.videoFilesUpdate3 && this.videoFilesUpdate3.length > 0 && this.selectedVideoNum == '3') {
      for (let k = 0; k < this.videoFilesUpdate3.length; k++) {
        formData.append('pv3bhk[]', this.videoFilesUpdate3[k]);
      }
      formData.append('pvbhkId', '3');
    } else {
      formData.append('pv3bhk[]', '');
    }

    if (this.videoFilesUpdate4 && this.videoFilesUpdate4.length > 0 && this.selectedVideoNum == '4') {
      for (let k = 0; k < this.videoFilesUpdate4.length; k++) {
        formData.append('pv4bhk[]', this.videoFilesUpdate4[k]);
      }
      formData.append('pvbhkId', '4');
    } else {
      formData.append('pv4bhk[]', '');
    }

    if (this.videoFilesUpdate0 && this.videoFilesUpdate0.length > 0 && this.selectedVideoNum == '0') {
      for (let k = 0; k < this.videoFilesUpdate0.length; k++) {
        formData.append('pv0bhk[]', this.videoFilesUpdate0[k]);
      }
      formData.append('pvbhkId', '0');
    } else {
      formData.append('pv0bhk[]', '');
    }

    this.filterLoader = true;
    this._mandateService.updateVideo(formData).subscribe((resp) => {
      this.filterLoader = false;
      swal({
        text: 'Video Added Successfully',
        type: 'success',
        timer: 1000,
        showConfirmButton: false
      })
      this.getAllProperties();
    })
  }

  //update project Info
  updateProjectInfo() {
    if (this.selectedProperties == '' || this.selectedProperties == undefined || this.selectedProperties == null || this.selectedProperties.length == 0) {
      swal({
        title: 'Select the Property',
        type: 'error',
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    }

    // if (this.projectInfo == "" || this.projectInfo == undefined || this.projectInfo == null) {
    //   swal({
    //     title: 'Project Info',
    //     text: 'Project Info is not provided',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }

    // if (this.floorFilesOnUpdate && this.floorFilesOnUpdate.length > 0 && this.floorFilesOnUpdate.length != this.sqftArraylength) {
    //   swal({
    //     title: 'Floor Plans SQFT',
    //     text: 'Please Update all the Floor Plans SQFT for 1BHK',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }

    // if (this.floorFilesOnUpdate2 && this.floorFilesOnUpdate2.length > 0 && this.floorFilesOnUpdate2.length != this.sqftArraylength2) {
    //   swal({
    //     title: 'Floor Plans SQFT',
    //     text: 'Please Update all the Floor Plans SQFT for 2BHK',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }

    // if (this.floorFilesOnUpdate3 && this.floorFilesOnUpdate3.length > 0 && this.floorFilesOnUpdate3.length != this.sqftArraylength3) {
    //   swal({
    //     title: 'Floor Plans SQFT',
    //     text: 'Please Update all the Floor Plans SQFT for 3BHK',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }

    // if (this.floorFilesOnUpdate4 && this.floorFilesOnUpdate4.length > 0 && this.floorFilesOnUpdate4.length != this.sqftArraylength4) {
    //   swal({
    //     title: 'Floor Plans SQFT',
    //     text: 'Please Update all the Floor Plans SQFT for 4BHK',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }

    // if (this.floorFilesOnUpdate0 && this.floorFilesOnUpdate0.length > 0 && this.floorFilesOnUpdate0.length != this.sqftArraylength0) {
    //   swal({
    //     title: 'Floor Plans SQFT',
    //     text: 'Please Update all the Floor Plans SQFT for Common',
    //     type: 'error',
    //     timer: 2000,
    //     showConfirmButton: false
    //   })
    //   return false;
    // }

    let formData = new FormData();
    formData.append('detailsId', this.selectedEditProp.detailsId);
    formData.append('projectid', this.selectedProperties);
    formData.append('projectinfo', this.projectInfo);
    // formData.append('fpbhkId', this.selectedFloorPlanNum);
    let fpbhkIdarray = []

    if (this.floorFilesOnUpdate && this.floorFilesOnUpdate.length > 0) {
      for (let k = 0; k < this.floorFilesOnUpdate.length; k++) {
        formData.append('fp1bhk[]', this.floorFilesOnUpdate[k]);
      }
      fpbhkIdarray.push('1');
      formData.append('fp1bhksqft', this.updateonPostSqrt.join(','));
    } else {
      formData.append('fp1bhk[]', '');
      formData.append('fp1bhksqft', '');
    }

    if (this.floorFilesOnUpdate2 && this.floorFilesOnUpdate2.length > 0) {
      for (let k = 0; k < this.floorFilesOnUpdate2.length; k++) {
        formData.append('fp2bhk[]', this.floorFilesOnUpdate2[k]);
      }
      fpbhkIdarray.push('2');
      formData.append('fp2bhksqft', this.updateonPostSqrt2.join(','));
    } else {
      formData.append('fp2bhk[]', '');
      formData.append('fp2bhksqft', '');
    }

    if (this.floorFilesOnUpdate3 && this.floorFilesOnUpdate3.length > 0) {
      for (let k = 0; k < this.floorFilesOnUpdate3.length; k++) {
        formData.append('fp3bhk[]', this.floorFilesOnUpdate3[k]);
      }
      fpbhkIdarray.push('3');
      formData.append('fp3bhksqft', this.updateonPostSqrt3.join(','));
    } else {
      formData.append('fp3bhk[]', '');
      formData.append('fp3bhksqft', '');
    }

    if (this.floorFilesOnUpdate4 && this.floorFilesOnUpdate4.length > 0) {
      for (let k = 0; k < this.floorFilesOnUpdate4.length; k++) {
        formData.append('fp4bhk[]', this.floorFilesOnUpdate4[k]);
      }
      fpbhkIdarray.push('4');
      formData.append('fp4bhksqft', this.updateonPostSqrt4.join(','));
    } else {
      formData.append('fp4bhk[]', '');
      formData.append('fp4bhksqft', '');
    }

    if (this.floorFilesOnUpdate0 && this.floorFilesOnUpdate0.length > 0) {
      for (let k = 0; k < this.floorFilesOnUpdate0.length; k++) {
        formData.append('fp0bhk[]', this.floorFilesOnUpdate0[k]);
      }
      fpbhkIdarray.push('0');
      formData.append('fp0bhksqft', this.updateonPostSqrt0.join(','));
    } else {
      formData.append('fp0bhk[]', '');
      formData.append('fp0bhksqft', '');
    }

    formData.append('fpbhkId', fpbhkIdarray.join(','));

    this.filterLoader = true;
    this._mandateService.updatePropertyInfo(formData).subscribe((resp) => {
      this.filterLoader = false;
      swal({
        text: 'Project Details Updated Successfully',
        type: 'success',
        timer: 1000,
        showConfirmButton: false
      }).then(() => {
        $('#editpropclose').click();
        this.floorFilesOnUpdate = [];
        this.floorFilesOnUpdate0 = [];
        this.floorFilesOnUpdate2 = [];
        this.floorFilesOnUpdate3 = [];
        this.floorFilesOnUpdate4 = [];
        this.updateonPostSqrt = [];
        this.updateonPostSqrt0 = [];
        this.updateonPostSqrt2 = [];
        this.updateonPostSqrt3 = [];
        this.updateonPostSqrt4 = [];
        this.getAllProperties();
      })
    })
  }

  //delete video while update
  deleteVideo(num, i, video) {
    // let videoId,videofilename;
    // if(num == 0){

    // } else if(num == 1){

    // } else if(num == 2){

    // } else if(num == 3){

    // } else if(num == 4){

    // } 
    let param = {
      detailid: this.selectedEditProp.detailsId,
      videoId: video.PV_IDPK,
      videofilename: video.propdetails_video
    }

    this._mandateService.deleteVideo(param).subscribe((resp) => {
      swal({
        text: 'Video Deleted Successfully',
        type: 'success',
        timer: 1000,
        showConfirmButton: false
      })
      this.getAllProperties();
    })
  }

  //make params changes in service and int his method
  deletePriceSheetImage(num) {
    let pricesheetId: any;
    let priceSheetFileName: any;
    if (num == '1') {
      pricesheetId = this.priceSheetFiles[0].PS_IDPK;
      priceSheetFileName = this.priceSheetFiles[0].propdetails_pricesheet;
    } else if (num == '2') {
      pricesheetId = this.priceSheetFiles2[0].PS_IDPK;
      priceSheetFileName = this.priceSheetFiles2[0].propdetails_pricesheet;
    } else if (num == '3') {
      pricesheetId = this.priceSheetFiles3[0].PS_IDPK;
      priceSheetFileName = this.priceSheetFiles3[0].propdetails_pricesheet;
    } else if (num == '4') {
      pricesheetId = this.priceSheetFiles4[0].PS_IDPK;
      priceSheetFileName = this.priceSheetFiles4[0].propdetails_pricesheet;
    } else if (num == '0') {
      pricesheetId = this.priceSheetFiles0[0].PS_IDPK;
      priceSheetFileName = this.priceSheetFiles0[0].propdetails_pricesheet;
    }
    let param = {
      detailid: this.selectedEditProp.detailsId,
      psid: pricesheetId,
      pricesheetname: priceSheetFileName
    }
    this._mandateService.deletepriceSheet(param).subscribe((resp) => {
      swal({
        text: `PriceSheet Deleted Successfully for ` + num + 'BHK',
        type: 'success',
        timer: 1000,
        showConfirmButton: false
      })
      if (num == '1') {
        this.priceSheetFiles = [];
      } else if (num == '2') {
        this.priceSheetFiles2 = [];
      } else if (num == '3') {
        this.priceSheetFiles3 = [];
      } else if (num == '4') {
        this.priceSheetFiles4 = [];
      } else if (num == '0') {
        this.priceSheetFiles0 = [];
      }
      this.getAllProperties();
    })
  }

  deleteFloorPlans(num, floor) {
    let floorplanId: any;
    let floorPlanName: any;
    if (num == '1') {
      floorplanId = floor.PF_IDPK;
      floorPlanName = floor.floorplan_image;
    } else if (num == '2') {
      floorplanId = floor.PF_IDPK;
      floorPlanName = floor.floorplan_image;
    } else if (num == '3') {
      floorplanId = floor.PF_IDPK;
      floorPlanName = floor.floorplan_image;
    } else if (num == '4') {
      floorplanId = floor.PF_IDPK;
      floorPlanName = floor.floorplan_image;
    } else if (num == '0') {
      floorplanId = floor.PF_IDPK;
      floorPlanName = floor.floorplan_image;
    }
    let param = {
      detailid: this.selectedEditProp.detailsId,
      pfid: floorplanId,
      floorplanName: floorPlanName
    }
    this._mandateService.deletefloorplan(param).subscribe((resp) => {
      swal({
        text: `PriceSheet Deleted Successfully for ` + num + 'BHK',
        type: 'success',
        timer: 1000,
        showConfirmButton: false
      })
      if (num == '1') {
        this.priceSheetFiles = [];
      } else if (num == '2') {
        this.priceSheetFiles2 = [];
      } else if (num == '3') {
        this.priceSheetFiles3 = [];
      } else if (num == '4') {
        this.priceSheetFiles4 = [];
      } else if (num == '0') {
        this.priceSheetFiles0 = [];
      }
      this.getAllProperties();
    })
  }

}
