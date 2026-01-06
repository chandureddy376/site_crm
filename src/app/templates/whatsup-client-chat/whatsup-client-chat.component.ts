import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { sharedservice } from '../../shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { EchoService } from '../../echo.service';
import { HttpClient } from '@angular/common/http';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-whatsup-client-chat',
  templateUrl: './whatsup-client-chat.component.html',
  styleUrls: ['./whatsup-client-chat.component.css'],
  // encapsulation: ViewEncapsulation.None
})

export class WhatsupClientChatComponent implements OnInit {

  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  allchatparam: any;
  unreadchatparam: any;
  selectedIndex: number = -1;
  search_client_name: string = '';
  clientsList: any[] = [];
  copyOfClientsList: any;
  filterLoader: boolean = true;
  roleid: any;
  userid: any;
  searchExecutivesList: any[] = [];
  copyOfSearchExecutivesList: any[] = [];
  selectedexec: any;
  isSearchGlobal: boolean = false;
  global_search_client: string = '';
  private shouldAutoScroll = true;
  shouldShowArrow: boolean = false;
  @ViewChild('messageContainer') messageContainer: ElementRef;
  messageList: any;
  assignedExecutivesList: any;
  selectedAssignee: any;
  imagesFiles: any[] = [];
  imagesuploads: string[] = [];
  isSending: boolean = false;
  imageUrls: SafeUrl[] = [];
  send_message: string = '';
  selectedPersonChat: any;
  chatid: any;
  isMessageBlocked: boolean = false;
  isSearch: boolean = false;
  messages_search: string = '';
  searchedMessageList: any[] = [];
  execid: any;
  selectedMessageOption: any;
  selectedOptionText: any;
  isEditenable: boolean = true;
  textareaRows: number = 1;
  maxRows: number = 8;
  popoverNumber: string | null = null;
  popoverPosition: { top: number; left: number } | null = null;
  showToast = false;
  toastTimeout: any;
  isDelete: boolean = true;
  selectedForwardExecutives: any;
  executive_name: string = '';
  searchfilterLoader: boolean = false;
  searchSubject: Subject<string> = new Subject();
  selectedMessages: any[] = [];
  isForwardMode: boolean = false;
  exec_selected:any;
  checkedExecutive:any;
  loggedUserId:any;
  click:any;

  constructor(
    private readonly _sharedService: sharedservice,
    private readonly route: ActivatedRoute,
    private readonly _echoService: EchoService,
    private readonly router: Router,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {
    this.roleid = localStorage.getItem('Role');
    // console.log(this.selectedexec)
    if (this.selectedexec == null || this.selectedexec == undefined || this.selectedexec == '') {
      this.userid = localStorage.getItem('whatsappExecId');
    } else {
      this.userid = this.execid;
    }
    this.getChatList();
  }

  ngOnInit() {
    this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });
    // if(this.roleid == 1){
    this.getExecutivesList();
    // }

    this.searchSubject
      .debounceTime(500)               // Wait for 300ms pause in input
      .distinctUntilChanged()          // Only fire if input changed
      .subscribe(term => {
        this.searchClient(term);      // Move your logic to this method
      });

    // this.assignedExecutivesList = [
    //   { id: 1, name: 'Kiran' },
    //   { id: 2, name: 'Dan' },
    //   { id: 3, name: 'Jagan' },
    //   { id: 4, name: 'Lidiya' },
    // ]

    this._echoService.listenToDatabaseChanges((data) => {
      console.log(data,'eco service')
      const messagesArray = data[1];
      if (Array.isArray(messagesArray) && messagesArray.length > 0) {
        let lastMessage;
        if (messagesArray.length > 1) {
          let chatdata = this.clientsList.filter((chat) => chat.customer_number == this.chatid);
          this.selectedPersonChat = chatdata[0];
          lastMessage = messagesArray[messagesArray.length - 1];
        } else if (messagesArray.length == 1) {
          lastMessage = messagesArray[0];
        }
        let alreadyExists
        if (this.messageList) {
          alreadyExists = this.messageList.some(
            msg => msg.item_id === lastMessage.item_id
          );
        }
        if (!alreadyExists) {
          // console.log(this.userid)
          if ((lastMessage.sender_id == this.userid || lastMessage.sender_id == this.selectedPersonChat.customer_number) || (this.userid == 1 && lastMessage.sender_id == this.checkedExecutive)) {
            this.messageList = this.messageList.filter((mes) => { return mes.item_id != '' });
            this.messageList.push(lastMessage);
            this.updatedAsMessageRead(this.selectedPersonChat)
          } else if (messagesArray.length == 1) {
            this.getChatListForWhatsAppFreshChat().subscribe(exec => {
              this.clientsList = exec.details;
              this.copyOfClientsList = exec['details'];

              let executives = this.clientsList.filter((chat) => {
                return chat.customer_number == this.chatid;
              })

              this.selectedPersonChat = executives[0];

              if ((lastMessage.sender_id == this.userid || lastMessage.sender_id == this.selectedPersonChat.customer_number)  || (this.userid == 1 && lastMessage.sender_id == this.checkedExecutive)) {
                this.messageList = this.messageList.filter((mes) => { return mes.item_id != '' });
                this.messageList.push(lastMessage);
                this.updatedAsMessageRead(this.selectedPersonChat)
              }
            })
          }
          // Auto-scroll to the bottom
          setTimeout(() => {
            // if (this.messageContainer && this.messageContainer.nativeElement) {
            //   const element = this.messageContainer.nativeElement;
            //   element.scrollTop = element.scrollHeight;
            // }
            this.scrollToBottom();
          }, 100);
          // if (messagesArray.length > 1 && ((lastMessage.customer_number != this.selectedPersonChat.customer_number) || this.selectedPersonChat == null)) { 
          if (messagesArray.length > 1 && ((lastMessage.sender_id != this.userid) || this.selectedPersonChat == null)) {
            this.getListOfChat();
          }
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.hoverSubscription) {
      this.hoverSubscription.unsubscribe();
    }
    if (this.renderer) {
      this.renderer.removeStyle(document.documentElement, 'overflow');
      this.renderer.removeStyle(document.body, 'overflow');
    }
    let Id = localStorage.getItem('UserId');
    localStorage.setItem('whatsappExecId', Id);
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    if (this.shouldAutoScroll) {
      this.scrollToBottom();
    }
  }

  getExecutivesList() {
    this._sharedService.getexecutiveslist('', '', '','','').subscribe((exec) => {
      this.searchExecutivesList = exec;
      this.copyOfSearchExecutivesList = exec;
    })
  }

  //This method is written to get the chat list and using this till we get the response next move cant be done in eco service subscribe in Init
  getChatListForWhatsAppFreshChat(): Observable<any> {
    return this._sharedService.getAllWhatsAppChats(this.userid,this.exec_selected);
  }

  getChatList() {
    this.searchfilterLoader = true;
    this._sharedService.getAllWhatsAppChats(this.userid, this.exec_selected).subscribe((exec) => {
      this.filterLoader = false;
      this.searchfilterLoader = false;;
      this.clientsList = exec['details'];
      this.copyOfClientsList = exec['details'];
      this.chatid = exec['chatid'];

      if (exec['index']) {
        this.selectedIndex = exec['index'];
      } else {
        this.selectedIndex = -1;
      }
      console.log(this.chatid)
      if (this.chatid) {
        let chatdata = this.clientsList.filter((chat) => chat.customer_number == this.chatid);
        this.selectedPersonChat = chatdata[0];
        console.log(this.selectedPersonChat)
        this.getOneToOneChat();
        setTimeout(() => {
          this.scrollToBottom();
        }, 0)
      } else {
        this.selectedPersonChat = '';
      }

      if (this.allchatparam == '1') {
        this.selectedChatType('all')
      } else if (this.unreadchatparam == '1') {
        this.selectedChatType('unread')
      }
      this.getData();
    })
  }

  // In this method we captured the queryparams and triggered the need methods.
  getData() {
    console.log('triggered')
    this.route.queryParams.subscribe((params) => {
      console.log(params)
      this.allchatparam = params['allchat'];
      this.unreadchatparam = params['unreadchat'];
      this.chatid = params['chatid'];
      this.execid = params['execid'];
      this.click = params['click'];
      if (params['index']) {
        this.selectedIndex = params['index'];
      } else {
        this.selectedIndex = -1;
      }

      if(this.click == 1){
          this.search_client_name = this.chatid;
          this.searchClient('');
          return;
      }

      if (this.execid) {
        let execData = this.searchExecutivesList.filter((exec) => {
          return exec.ID == this.execid
        });
        this.selectedexec = execData[0];
        this.userid = this.execid;
        this.getListOfChat();
      } else {
        this.selectedexec = '';
        this.userid = localStorage.getItem('whatsappExecId');
        this.getListOfChat();
      }

      if (this.chatid) {
        let chatdata = this.clientsList.filter((chat) => chat.customer_number == this.chatid);
        this.selectedPersonChat = chatdata[0];
        if((this.roleid == 1 || this.roleid == 2 ) && (this.execid == null || this.execid == undefined || this.execid == '')){
          if(this.selectedPersonChat.execid == null || this.selectedPersonChat.execid == undefined || this.selectedPersonChat.execid == ''){
             this.checkedExecutive = this.userid;
          } else {
            this.checkedExecutive = this.selectedPersonChat.execid;
          }
          localStorage.setItem('checkedExecutive', this.checkedExecutive);
        } else {
          this.checkedExecutive = this.userid;
        }
        this.getOneToOneChat();
        setTimeout(() => {
          this.scrollToBottom();
        }, 0)
      } else {
        this.selectedPersonChat = '';
      }

      if (this.allchatparam == '1') {
        this.selectedChatType('all');
      } else if (this.unreadchatparam == '1') {
        this.selectedChatType('unread');
      }
    })
  }

  // here we get the chat histroy based on the selected chat id 
  getOneToOneChat() {
    console.log(this.selectedPersonChat,this.checkedExecutive);
    let id;
     if((this.roleid == 1 || this.roleid == 2 ) && (this.execid == null || this.execid == undefined || this.execid == '')){
      id = 1;
     } else {
      id = this.checkedExecutive
     }
    let param = {
      loginid: id,
      recId: this.selectedPersonChat.customer_number
    }
    console.log(param)
    this.filterLoader = true;
    this._sharedService.get121WhatsappChats(param).subscribe((resp) => {
      this.filterLoader = false;
      this.isMessageBlocked = false;
      if (resp.status == 'True') {
        this.messageList = resp['details'];
        this.assignedExecutivesList = resp['executives'];
        this.messageList = this.messageList.map(m => {
          try {
            return Object.assign({}, m, {
              content: JSON.parse('"' + m.content + '"')
            });
          } catch (e) {
            return Object.assign({}, m, {
              content: m.content.replace(/\\t/g, '\t').replace(/\\n/g, '\n')
            });
          }
        });
        setTimeout(() => {
          // if (this.messageContainer && this.messageContainer.nativeElement) {
          //   const element = this.messageContainer.nativeElement;
          //   element.scrollTop = element.scrollHeight;
          // }
          this.scrollToBottom();
        }, 100);
      } else {
        this.messageList = [];
      }
    })
  }

  //here we will get selected chat type i.e all,group,unread etc,
  selectedChatType(type) {
    console.log(type)
    $('.add_class').removeClass('active');
    if (type == 'all') {
      $('.all_chat').addClass('active');
      this.clientsList = this.copyOfClientsList;
    } else if (type == 'unread') {
      $('.unread_chat').addClass('active');
      this.clientsList = this.copyOfClientsList.filter((mem) => {
        return mem.unreadcount > 0;
      });
    }
    this.search_client_name = '';
  }

  executiveSelect(event) {
    if (this.selectedexec) {
      this.userid = this.selectedexec.ID;
    } else {
      this.userid = localStorage.getItem('whatsappExecId')
    }

    localStorage.setItem('checkedExecutive', '');
    this.exec_selected = this.selectedexec.ID;
    localStorage.setItem('whatsappExecId', this.userid);
    if(this.selectedexec.ID != 1){
      setTimeout(() => {
        this.router.navigate([], {
          queryParams: {
            allchat: '1',
            execid: this.selectedexec.ID
          },
          // queryParamsHandling: 'merge'
        })
      }, 0)
    } else {
      setTimeout(() => {
        this.router.navigate([], {
          queryParams: {
            allchat: '1',
            execid: ''
          },
          // queryParamsHandling: 'merge'
        })
      }, 0)
    }
  }

  // here we get the searched client by number or name 
  // searchClient() {
  //   console.log(this.search_client_name, this.search_client_name.length)
  //   let unreadChats: any;
  //   if (this.copyOfClientsList) {
  //     unreadChats = this.copyOfClientsList.filter((list) => {
  //       return list.unreadcount > 0;
  //     });
  //   }
  //   let length = 0;
  //   if (this.search_client_name) {
  //     const input = this.search_client_name.trim();
  //     const isNumber = /^\d+$/.test(input);
  //     if (isNumber) {
  //       length = 5;
  //     } else {
  //       length = 3
  //     }
  //   }


  //   if (this.search_client_name) {
  //     console.log(this.search_client_name.length)
  //     if (this.allchatparam == '1') {
  //       // this.clientsList = this.copyOfClientsList.filter((exec) => {
  //       //   return exec.executives_name.toLowerCase().includes(this.search_client_name.toLowerCase());
  //       // });
  //       let userid;
  //       if (localStorage.getItem('UserId') == '1') {
  //         userid = '';
  //       } else {
  //         userid = localStorage.getItem('UserId');
  //       }
  //       console.log('entered', this.search_client_name.length, length)
  //       if (this.search_client_name.length >= length) {
  //         console.log('entered')
  //         this._sharedService.search(this.search_client_name, '', userid).subscribe((data) => {
  //           console.log(data)
  //           this.clientsList = data;
  //           if (this.clientsList == undefined || this.clientsList == null || (this.clientsList && this.clientsList.length == 0)) {
  //             // if (this.search_client_name.length == 10) {
  //             //   if (this.debounceTimer) {
  //             //     clearTimeout(this.debounceTimer);
  //             //   }
  //             //   this.debounceTimer = setTimeout(()=>{
  //             //     this._sharedService.checkNumberForWhatsApp(this.search_client_name).subscribe((resp) => {
  //             //       console.log(resp)
  //             //     })
  //             //   },100)
  //             // } else {
  //             //   if (this.debounceTimer) {
  //             //     clearTimeout(this.debounceTimer);
  //             //   }
  //             // }
  //           }
  //         })
  //       }
  //     } else if (this.unreadchatparam == '1') {
  //       this.copyOfClientsList = unreadChats.filter((unread) => {
  //         return unread.executives_name.toLowerCase().includes(this.search_client_name.toLowerCase());
  //       })
  //     }
  //   } else {
  //     if (this.allchatparam == '1') {
  //       this.clientsList = this.copyOfClientsList;
  //     } else if (this.unreadchatparam == '1') {
  //       this.clientsList = unreadChats
  //     }
  //   }
  // }

  searchClient(term: string) {
    let unreadChats: any;
    if (this.copyOfClientsList) {
      unreadChats = this.copyOfClientsList.filter((list) => {
        return list.unreadcount > 0;
      });
    }

    let length = 0;
    if (this.search_client_name) {
      const input = this.search_client_name.trim();
      const isNumber = /^\d+$/.test(input);
      if (isNumber) {
        length = 5;
      } else {
        length = 3
      }
    }

    if (this.search_client_name) {
      if (this.allchatparam == '1') {
        let userid;
        if (localStorage.getItem('UserId') == '1') {
          userid = '';
        } else {
          userid = localStorage.getItem('UserId');
        }
        if (this.search_client_name.length >= length) {
          this.searchfilterLoader = true;
          this._sharedService.search(this.search_client_name, '', userid,'','').subscribe((data) => {
            console.log(data)
            this.searchfilterLoader = false;
            this.clientsList = data;
            if (this.clientsList == undefined || this.clientsList == null || (this.clientsList && this.clientsList.length == 0)) {
              //   if (this.search_client_name.length == 10) {
              //     if (this.debounceTimer) {
              //       clearTimeout(this.debounceTimer);
              //     }
              //     this.debounceTimer = setTimeout(()=>{
              //       this._sharedService.checkNumberForWhatsApp(this.search_client_name).subscribe((resp) => {
              //         console.log(resp)
              //       })
              //     },100)
              //   } else {
              //     if (this.debounceTimer) {
              //       clearTimeout(this.debounceTimer);
              //     }
              //   }
              this.clientsList = [];
            }
          })
        }
      } else if (this.unreadchatparam == '1') {
        this.copyOfClientsList = unreadChats.filter((unread) => {
          return unread.executives_name.toLowerCase().includes(this.search_client_name.toLowerCase());
        })
      }
    } else {
      if (this.allchatparam == '1') {
        this.clientsList = this.copyOfClientsList;
      } else if (this.unreadchatparam == '1') {
        this.clientsList = unreadChats
      }
    }
  }

  globalSearch() {
    this.isSearchGlobal = true;
  }

  goBackToHome() {
    this.isSearchGlobal = false;
    this.global_search_client = '';
  }

  // here we get the list of chats only.
  getListOfChat() {
    this.searchfilterLoader = true;
    this._sharedService.getAllWhatsAppChats(this.userid,this.exec_selected).subscribe((exec) => {
      this.filterLoader = false;
      this.searchfilterLoader = false;
      this.clientsList = exec['details'];
      this.copyOfClientsList = exec['details'];
      if (this.unreadchatparam == '1') {
        this.clientsList = this.copyOfClientsList.filter((mem) => {
          return mem.unreadcount > 0;
        })
      }
    })
  }

  //here we get the data of the particular selected chat from the list.
  selectedchat(chat, index) {
    console.log(chat, index);
    if (this.search_client_name != '' && this.search_client_name != undefined && this.search_client_name != null && this.search_client_name.length > 0) {
      // $('#ischeckModal').click();
      // this._sharedService.checkNumberForWhatsApp(chat.customer_number).subscribe((resp) => {
        // if (resp.contacts && resp.contacts[0].status == 'valid') {
            // $('#isCheckNumberclose').click();
          this.selectedPersonChat = chat;
          console.log(this.selectedPersonChat)
          // this.search_client_name = '';
          if (this.selectedPersonChat.customer_number != chat.customer_number) {
            this.selectedIndex = index;
          }
          this.checkedExecutive = this.selectedPersonChat.execid;
          console.log(this.checkedExecutive)
          // this.updatedAsMessageRead(chat.customer_number);
          this._sharedService.setIndicationForWhatsappChatSelection('chatselected');
          this.send_message = '';
          // setTimeout(() => {
          //   this.getListOfChat();
          // }, 0)
          console.log(chat)
          this.router.navigate([], {
            queryParams: {
              chatid: chat.customer_number,
              index: index,
            },
            queryParamsHandling: 'merge'
          })
        // } else {
        //   $('#isCheckNumberclose').click();
        //   setTimeout(()=>{
        //     swal({
        //       title: 'Number Not Registered',
        //       text: `This number is not Registered with What's App`,
        //       type: "error",
        //       timer: 2000,
        //       showConfirmButton: false
        //     })
        //   },0)
        //   return false;
        // }
      // })
    } else {

      this.updatedAsMessageRead(chat);
      this.selectedPersonChat = chat;
      // if ((this.roleid == 1 || this.roleid == 2) && !this.execid) {
      //   this.checkedExecutive = this.selectedPersonChat.execid;
      //   localStorage.setItem('checkedExecutive', this.checkedExecutive);
      // } else {
      //   this.checkedExecutive = this.userid;
      // }
      this.search_client_name = '';
      if (this.selectedPersonChat.customer_number != chat.customer_number) {
        this.selectedIndex = index;
      }
      this._sharedService.setIndicationForWhatsappChatSelection('chatselected');
      this.send_message = '';
      setTimeout(() => {
        this.getListOfChat();
      }, 0)
      this.router.navigate([], {
        queryParams: {
          chatid: chat.customer_number,
          index: index,
        },
        queryParamsHandling: 'merge'
      })
    }

  }

  //here we close the chat in right side opened section.
  closechat() {
    this.selectedPersonChat = '';
    this.router.navigate([], {
      queryParams: {
        chatid: '',
        index: '',
      }, queryParamsHandling: 'merge'
    })

  }

  //here in this method we will get to know whether its a manual scroll and enable the scrolling.
  onScroll() {
    const element = this.messageContainer.nativeElement;
    const threshold = 0;
    const position = element.scrollTop + element.clientHeight;
    const height = element.scrollHeight;
    this.shouldAutoScroll = (height - position) < threshold;

    const difference = height - position;
    if (difference > 10) {
      this.shouldShowArrow = true;
    } else {
      this.shouldShowArrow = false;
    }
  }

  //here in this method the croll will be at the bottom of the div conatiner.
  scrollToBottom(): void {
    try {
      if (this.messageContainer && this.messageContainer.nativeElement) {
        const element = this.messageContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  assigneechange(event) {
    console.log(event.target.value);
    this.checkedExecutive = event.target.value;
    localStorage.setItem('checkedExecutive', this.checkedExecutive);
    this.getOneToOneChat();
  }

  // here this method is triggered while we enter the text and clik enter Button.
  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        // Allow new line
        return;
      }

      event.preventDefault();

      if (this.imagesFiles.length > 0) {
        this.uploadImageWithMessage();
      } else {
        this.sendMessage();
      }
    }
  }

  // here we get the searched name 
  searchExecutive() {
    console.log('triggered')
    let unreadChats: any;

    unreadChats = this.copyOfClientsList.filter((list) => {
      return list.unreadcount > 0;
    });

    if (this.search_client_name) {
      if (this.allchatparam == '1') {
        this.clientsList = this.copyOfClientsList.filter((exec) => {
          return exec.customer_number.toLowerCase().includes(this.search_client_name.toLowerCase()) || (exec.latest_message_content && exec.latest_message_content.toLowerCase().includes(this.search_client_name.toLowerCase()));
        });
      } else if (this.unreadchatparam == '1') {
        this.clientsList = unreadChats.filter((unread) => {
          return unread.customer_number.toLowerCase().includes(this.copyOfClientsList.toLowerCase()) || (unread.latest_message_content && unread.latest_message_content.toLowerCase().includes(this.search_client_name.toLowerCase()));
        })
      }
    } else {
      if (this.allchatparam == '1') {
        this.clientsList = this.copyOfClientsList;
      } else if (this.unreadchatparam == '1') {
        this.clientsList = unreadChats
      }
    }
  }

  searchForwardMessageExecutive() {
    if (this.search_client_name) {
      const searchText = this.search_client_name.toLowerCase();

      this.clientsList = this.copyOfClientsList.slice().sort((a, b) => {
        const aMatch = a.executives_name.toLowerCase().includes(searchText);
        const bMatch = b.executives_name.toLowerCase().includes(searchText);

        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    } else {
      this.clientsList = this.copyOfClientsList.slice();
      this.search_client_name = '';
    }
  }

  //here this method is triggered wile sending only the message.
  sendMessage() {
    let param;
    let messid = '';
    let editid = '';

    if (this.selectedMessageOption == 'reply' || this.selectedMessageOption == 'replywithmessage') {
      messid = this.selectedOptionText.item_id;
    } else if (this.selectedMessageOption == 'edit') {
      editid = '1';
      messid = this.selectedOptionText.item_id;
    }

    param = {
      loginid: this.checkedExecutive,
      recieverid: this.chatid,
      message: this.send_message.trim(),
      messageid: messid,
      edit: editid
    }

    let messageData = this.send_message.trim();
    if ((messageData == '' || messageData == undefined || messageData == null) && this.imagesFiles && this.imagesFiles.length == 0) {
      this.filterLoader = false;
      swal({
        title: 'Empty Message/Spaces not Allowed',
        text: 'Please Enter a Message',
        type: "error",
        timer: 2000,
        showConfirmButton: false
      })
      return false;
    }

    if (this.imagesFiles.length > 0) {
      this.uploadImageWithMessage();
    } else {
      if (this.isSending) return;

      this.isSending = true;
      // let message = {
      //   chat_id: this.selectedPersonChat.chat_id,
      //   content: this.send_message.trim(),
      //   created_at: getCurrentDateTime(),
      //   item_type: "message",
      //   message_type: "text",
      //   sender_id: this.userid,
      //   sender_name: localStorage.getItem('Name'),
      //   updated_at: getCurrentDateTime(),
      //   item_id: '',
      //   edited: 0
      // };
      // console.log(message)
      // this.messageList.push(message);
      this.send_message = '';
      this.textareaRows = 1;
      // this.filterLoader = true;
      this._sharedService.sendWhatsappMessage(param).subscribe((resp) => {
        this.filterLoader = false;
        if (resp.status == 'True') {
          this.isSending = false;
          if (this.selectedMessageOption != 'edit') {
            this.selectedOptionText = '';
            this.selectedMessageOption = '';
          };
          this.getChatList();
          if (this.messageContainer && this.messageContainer.nativeElement) {
            const element = this.messageContainer.nativeElement;
            element.scrollTop = element.scrollHeight;
          }
          setTimeout(() => {
            $('#chatting_input_field').focus();
          }, 1000)
        } else if (resp.status == 'False') {
          this.isSending = false;
        }
      })
    }
  }

  //here this method is trigered only if we upload any files , with message is there or no.
  uploadImageWithMessage() {
    const requests = [];
    let messid = '';
    let editid = '';
    if (this.selectedMessageOption == 'reply' || this.selectedMessageOption == 'replywithmessage') {
      messid = this.selectedOptionText.item_id;
    } else if (this.selectedMessageOption == 'edit') {
      editid = '1';
      messid = this.selectedOptionText.item_id;
    }
    if (this.imagesFiles && this.imagesFiles.length > 0) {
      for (let k = 0; k < this.imagesFiles.length; k++) {
        console.log(this.imagesFiles[k])
        let type = getFileTypeFromUrl(this.imagesFiles[k].name);
        const formData = new FormData();
        formData.append('senderid', this.checkedExecutive);
        formData.append('recieverid', this.chatid);
        formData.append('message', this.send_message.trim());
        formData.append('chattype', type);
        formData.append('attachment', this.imagesFiles[k]);
        // formData.append('messageid', messid);
        // formData.append('edit', editid);
        requests.push(this._sharedService.sendwhatsappAttachment(formData));
      }
    } else {
      const formData = new FormData();
      formData.append('senderid', this.checkedExecutive);
      formData.append('recieverid', this.chatid);
      formData.append('message', this.send_message.trim());
      formData.append('attachment', '');
      formData.append('chattype', '');
      formData.append('messageid', messid);
      formData.append('edit', editid);
      requests.push(this._sharedService.sendwhatsappAttachment(formData));
    }

    // Use spread to pass observables as arguments (for RxJS 5)
    Observable.forkJoin(requests).subscribe((responses) => {
      this.send_message = '';
      this.imageUrls = [];
      this.imagesFiles = [];
      this.imagesuploads = [];
      $('.modal-backdrop').closest('div').remove();

      let currentUrl = this.router.url;
      let pathWithoutQueryParams = currentUrl.split('?')[0];
      let currentQueryparams = this.route.snapshot.queryParams;

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
      });
    });
  }

  //here on clicking plus icon file manager will be opened.
  addimages() {
    // Manually trigger the file input click to open the file dialog
    setTimeout(() => {
      const fileInput = document.getElementById('imagesFile0') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }, 0)
  }

  // Method to upload Files.
  Imageuploads(i, event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.filterLoader = true;

    if (files.length == 0) {
      this.filterLoader = false;
      this.imagesFiles = [];
      this.imagesuploads = [];
      this.imageUrls = [];
    }

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]; // Only one file, so we take the first one
        console.log(file)
        if (file.type !== 'application/pdf' && !this.isValidImageOrVideo(file)) {
          this.filterLoader = false;
          swal({
            title: 'Invalid File Type',
            text: 'Only PDF/PNG/JPEG/video files are allowed.',
            type: "error",
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            input.value = '';
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
            });
          } else {
            // Push the file to closurefiles and read the file
            const replacefile = file;
            // Remove '+' from the name
            const newFileName = replacefile.name.replace(/[+]/g, '');
            const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
            let editedFile = updatedFile;

            this.imagesFiles.push(editedFile);
            // this.flooruploads = [];
            const reader = new FileReader();
            reader.onload = (event: any) => {
              const blobUrl = reader.result as string;

              // Sanitize the blob URL to be safe for Angular's binding
              const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
              this.imageUrls.push(sanitizedUrl);
              this.imagesuploads.push(event.target.result);
              this.filterLoader = false;
              setTimeout(() => {
                $('#chatting_input_field').focus();
              }, 100)
            };
            reader.readAsDataURL(file);
            $('#imagesFile' + i).siblings(".file-label-" + i).addClass("selected").html(file.name);
          }
        }
      }
    }
    console.log(this.imagesFiles.length)
  }

  //here its check the type of the video and photo.
  isValidImageOrVideo(file: File): boolean {
    const imageExtensions = ['image/png', 'image/jpeg'];
    const videoExtensions = ['video/mp4', 'video/avi', 'video/mkv', 'video/webm', 'video/mov'];
    const audioExtensions = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg']
    return imageExtensions.includes(file.type) || videoExtensions.includes(file.type) || audioExtensions.includes(file.type);
  }

  //this is to validate the video type.
  isVideo(fileName: string): boolean {
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.webm', '.mov'];
    if (fileName) {
      return videoExtensions.some(extension => fileName.endsWith(extension));
    }
  }

  //this is to validate the audio type.
  isAudio(fileName: string): boolean {
    // const ext = fileName?.split('.').pop()?.toLowerCase();
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'm4a'];
    if (fileName) {
      return audioExtensions.some(extension => fileName.endsWith(extension));
    }
    // return audioExtensions.includes(ext);
  }

  //Here on clicking search the input field will be focused.
  searchMessage() {
    this.isSearch = true;
    setTimeout(() => {
      $('.search_messages').focus();
    }, 100)
  }

  //here we remove the file if not need ed before the upload.
  removeFiles(file: any, i: number): void {
    const index = this.imagesFiles.indexOf(file);
    if (index > -1) {
      this.imagesFiles.splice(index, 1);
      this.imagesuploads.splice(index, 1);
      this.imageUrls.splice(index, 1);

      if (this.imagesFiles.length == 0) {
        this.imagesFiles = [];
        this.imagesuploads = [];
        this.imageUrls = [];
      }

      // Optional: clear file input and label
      const fileInput = document.getElementById('imagesFile' + index) as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      const label = document.querySelector('.file-label-' + index);
      if (label) label.innerHTML = 'Choose file ';
    }
  }

  //Using this method we fetch the image , document and video
  getImagesFilesUrl(files) {
    const url = 'https://chat.right2shout.in' + files.attachment_path;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getImagesFilesUrlForClient(files) {
    const url = files.attachment_path;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


  //In this method we show the image in new tab
  showImageInTab(mes) {
    const link = this.renderer.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'https://chat.right2shout.in' + mes.attachment_path);
    // link.setAttribute('download', mes);
    link.click();
    link.remove();
  }

  //using this method we download the PDF.
  downloadPDF(message) {
    const link = this.renderer.createElement('a');
    link.setAttribute('target', '_self');
    link.setAttribute('href', 'https://chat.right2shout.in' + message.attachment_path);
    link.setAttribute('download', message);
    link.click();
    link.remove();
  }

  //using this method we download the PDF.
  downloadPDFClient(message: any) {
    this.http.get(message.attachment_path, { responseType: 'blob' }).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = message.attachment_name || 'document.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Download failed:', error);
        alert('Failed to download file.');
      }
    );
  }

  //Here on clicking search the input field will be focused.
  searchDetailMessage() {
    this.isSearch = true;
    setTimeout(() => {
      $('.search_messages').focus();
    }, 100)
  }

  //In this methode we close the search column.
  closeMessageSearch() {
    this.isSearch = false;
  }

  //Here we selected executives for forward messsage.
  getselectedForwardMessagesMembers() {
    var selectedObjects = $("input[name='programmingForword']:checked").map(function () {
      return JSON.parse($(this).attr('data-assign'));
    }).get();
    this.selectedForwardExecutives = selectedObjects;
    console.log(this.selectedForwardExecutives)
  }

  //In this method we de-select the  selected executives for forward message
  forwardExecutiveclose(i, exec) {
    if (this.selectedForwardExecutives) {
      this.selectedForwardExecutives = this.selectedForwardExecutives.filter((execid) => {
        return execid.chat_id != exec.chat_id;
      })
    }
  }

  //using this method we select or de-select the group members.
  isSelectedForwardExecutives(exec: any): boolean {
    if (this.selectedForwardExecutives) {
      return this.selectedForwardExecutives.some(e => e.chat_id == exec.chat_id);
    }
  }

  //here we search for a particular message or files in histroy chat.
  searchMessagesInp() {
    if (this.messages_search) {
      let messageList = this.messageList.filter((mes) => {
        return mes.item_type == 'message';
      });
      this.searchedMessageList = messageList.filter((data) => {
        return data.content.toLowerCase().includes(this.messages_search.toLowerCase());
      })
    } else {
      this.searchedMessageList = [];
    }
  }

  //In this method if the user searches for the particular message and clicks on it  we re-directed to that message in the message conatiner.
  searchedMessageClicked(searchedMes: any, type) {
    console.log(searchedMes)
    let targetId;
    if (type == 'search') {
      targetId = 'chat-item-' + searchedMes.item_id;
    } else if (type == 'rep') {
      targetId = 'chat-item-' + searchedMes.reply_id;
    }
    const element = document.getElementById(targetId);

    if (element) {
      // Scroll smoothly to the message
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a highlight class temporarily
      element.classList.add('highlight');
      setTimeout(() => element.classList.remove('highlight'), 2000);
    }
  }

  //in this method we make the unread count to read for the selected chat
  updatedAsMessageRead(chat) {
    let id;
    if(this.roleid == 1 || this.roleid == 2){
      id = this.checkedExecutive;
    } else {
      id = this.userid;
    }
    let param = {
      clientnum: id,
      chatid: chat.chat_id
    }
    console.log(this.userid),param
    this._sharedService.convertWhatsappMessageToRead(param).subscribe((resp) => {
      this.getListOfChat();
    })
  }

  getSelectedForwardMem() {
    $('#start5 span:checkbox').each(function () {
      this.checked = false;
    });

    var checkBoxes = $("#start3 span :checkbox:lt(" + event.target + ")");
    setTimeout(() => {
      $(checkBoxes).prop("checked", !checkBoxes.prop("checked"));
      $('input[id="forwardcheckboxid"]').attr("disabled", false);
      $('.forwardhidecheckbox').show();
    }, 100)
  }

  //on clicking on the more options get the message
  externalOptionMes(message) {
    console.log(message)
    if (!message.created_at) return false;

    const createdAt = new Date(message.created_at);
    const now = new Date();
    const diffInMs = now.getTime() - createdAt.getTime();
    const diffInMinutes = diffInMs / (1000 * 60);


    if (diffInMinutes >= 2) {
      this.isEditenable = false;
    } else {
      this.isEditenable = true;
    }

    if (diffInMinutes >= 10) {
      this.isDelete = false;
    } else {
      this.isDelete = true;
    }
  }

  //need to work based on the type API should triggered got mesaage options.
  messageOptions(type, message) {
    this.selectedMessageOption = type;
    this.selectedOptionText = message;
    if (type == 'delete') {
      swal({
        title: 'Delete Message?',
        text: 'confirm to delete Message..!',
        type: "info",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then((val) => {
        if (val.value == true) {
          this._sharedService.deleteMessage(message.item_id).subscribe((resp) => {
            if (resp.status == 'True') {
              this.getOneToOneChat();
              swal({
                title: 'Delete Message?',
                text: 'Successfully deleted the message',
                type: "success",
                showConfirmButton: false,
                timer: 2000
              });
            }
          })
        } else if (val.dismiss == 'cancel') {

        }
      })
    } else if (type == 'forward') {
      // this.getSelectedForwardMem();
      // $('#forward_message_btn').click();
       this.isForwardMode = true;
      this.selectedMessages.push(message);
    } else if (type == 'reply') {
      console.log('reply')
      setTimeout(() => {
        $('#chatting_input_field').focus();
      }, 100)
    } else if (type == 'replywithmessage') {
      console.log('reply', message)
      setTimeout(() => {
        $('#chatting_input_field').focus();
        this.send_message = message.content;
        setTimeout(() => {
          this.adjustRows();
        }, 0)
      }, 100)
    } else if (type == 'edit') {
      this.send_message = message.content;
      setTimeout(() => {
        $('#chatting_input_field').focus();
        setTimeout(() => {
          this.adjustRows();
        }, 0)
      }, 100)
    } else {
      swal({
        title: 'Coming Soon',
        text: 'Please wait for the new feature coming soon!',
        type: "info",
        timer: 2000,
        showConfirmButton: false
      })
    }
  }

  moveToForwardModal() {
    this.getSelectedForwardMem();
    $('#forward_message_btn').click();
  }

  onMessageSelect(event: any, message: any) {
    if (event.target.checked) {
      this.selectedMessages.push(message);
    } else {
      this.selectedMessages = this.selectedMessages.filter(m => m.item_id !== message.item_id);
    }
  }

  //in this message we forward message to the selected members
  forwardMessage() {
    let param;
    // let messid = '';
    // if (this.selectedMessageOption == 'forward') {
    //   messid = this.selectedOptionText.item_id;
    // }

    let messagesIds;
    if (this.selectedMessageOption == 'forward') {
      messagesIds = this.selectedMessages.map(({ item_id, content }) => ({
        id: item_id,
        message: content
      }));
    }

    let individualids;
    let individualArray = this.selectedForwardExecutives.filter((m) => {
      return m.chat_type == 'individual'
    })
    console.log(individualArray)
    let individualMapIds = individualArray.map(m => m.executives_IDPK);
    individualids = individualMapIds.join(',');
    console.log(individualids);

    // let groupArray = this.selectedForwardExecutives.filter((m) => {
    //   return m.chat_type == 'group'
    // })
    // console.log(groupArray)
    // let groupMapIds = groupArray.map(m => m.chat_id);
    // groupids = groupMapIds.join(',');
    // console.log(groupids);

    if (individualids) {
      param = {
        loginid: this.userid,
        recieverid: individualids,
        message: this.selectedOptionText.content,
        // messageid: messid,
        forward: '1',
        messages: messagesIds
      }

      this._sharedService.sendMessage(param).subscribe((resp) => {
        this.filterLoader = false;
        if (resp.status == 'True') {
          this.send_message = '';
          this.textareaRows = 1;
          this.isSending = false;
          this.selectedOptionText = '';
          this.selectedMessageOption = '';
          this.selectedMessages = [];
          $('.modal-backdrop').closest('div').remove();
          $('#forwardClose').click();
          this.selectedForwardExecutives = [];
          if (this.messageContainer && this.messageContainer.nativeElement) {
            const element = this.messageContainer.nativeElement;
            element.scrollTop = element.scrollHeight;
          }
          setTimeout(() => {
            $('#chatting_input_field').focus();
          }, 1000)
        } else if (resp.status == 'False') {
          this.isSending = false;
        }
      })
    }
  }

  closeForward() {
    this.isForwardMode = false;
    this.selectedMessages = [];
    this.selectedMessageOption = '';
  }

  closeReplyContent() {
    this.selectedOptionText = '';
    this.selectedMessageOption = '';
    this.send_message = '';
    setTimeout(() => {
      this.adjustRows();
    }, 0)
  }

  onCopy(event: ClipboardEvent, content: string) {
    const selectedText = window.getSelection().toString() || '';
    const normalizedSelected = normalizeText(selectedText);
    const normalizedContent = normalizeText(
      content
        .replace(/\\t/g, '\t')
        .replace(/\\n/g, '\n')
    );

    // If user selected *partial* text (not the entire message)
    if (normalizedSelected.length > 0 && normalizedSelected !== normalizedContent) {
      console.log('Partial text selected, default copy');
      return;
    }

    // Otherwise (no selection or entire message selected), override copy
    event.preventDefault();

    const cleanContent = content
      .replace(/\\t/g, '\t')
      .replace(/\\n/g, '\r\n');

    if (event.clipboardData) {
      event.clipboardData.setData('text/plain', cleanContent);
    }
  }

  adjustRows(): void {
    const lines = this.send_message.split('\n').length;

    // Estimate rows based on line count or content length
    const estimatedRows = Math.min(this.maxRows, lines + Math.floor(this.send_message.length / 50));

    this.textareaRows = Math.max(1, estimatedRows);
  }

  showCopiedToast() {
    this.showToast = true;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
    }, 1000);
  }

  numberClicked(phoneNumber: string, event: MouseEvent) {
    event.stopPropagation();

    const padding = 10;
    const popoverWidth = 200;
    const popoverHeight = 100;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const clickX = event.clientX;
    const clickY = event.clientY;

    if (this.popoverNumber === phoneNumber) {
      this.popoverNumber = null;
      this.popoverPosition = null;
    } else {
      this.popoverNumber = phoneNumber;

      // Default position (right)
      let left = clickX + padding;
      let top = clickY;

      // Check for right-side overflow
      if (clickX + popoverWidth + padding > viewportWidth) {
        // Place popover to the left
        left = clickX - popoverWidth - padding;
      }

      // Optional: handle bottom overflow
      if (clickY + popoverHeight + padding > viewportHeight) {
        top = viewportHeight - popoverHeight - padding;
      }

      this.popoverPosition = { top, left };
    }
  }

  copyNumber() {
    if (!this.popoverNumber) return;

    // Try modern clipboard API first
    if ((navigator as any).clipboard && (navigator as any).clipboard.writeText) {
      (navigator as any).clipboard.writeText(this.popoverNumber).then(() => {
        this.showCopiedToast();
        this.popoverNumber = null;
      }).catch(() => {
        this.fallbackCopy(this.popoverNumber);
      });
    } else {
      // Fallback for older browsers/iPads
      this.fallbackCopy(this.popoverNumber);
    }
  }

  fallbackCopy(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';

    document.body.appendChild(textarea);
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.showCopiedToast();
      }
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }

    document.body.removeChild(textarea);
    this.popoverNumber = null;
  }

  // Hide popover if user clicks outside
  @HostListener('document:click')
  onDocumentClick() {
    this.popoverNumber = null;
  }

  trackByFn(index: number, item: File) {
    return item.name; // or a unique identifier
  }

  clearSearchedResult() {
    this.search_client_name = '';
    if (this.allchatparam == '1') {
      $('.all_chat').addClass('active');
      this.clientsList = this.copyOfClientsList;
    } else if (this.unreadchatparam == 'unread') {
      $('.unread_chat').addClass('active');
      this.clientsList = this.copyOfClientsList.filter((mem) => {
        return mem.unreadcount > 0;
      });
    }
  }

  //lead search.
  globalSearchClient(){

  }

}

function normalizeText(str: string) {
  return str
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, '\t')
    .replace(/\s+/g, ' ')
    .trim();
}

function getFileTypeFromUrl(url: string): string {
  const parts = url.split('.');
  const extension = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';

  if (!extension) return 'unknown';

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'mkv', 'webm', 'mov', 'avi'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac'];
  const docExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];

  if (imageExtensions.indexOf(extension) !== -1) return 'image';
  if (videoExtensions.indexOf(extension) !== -1) return 'video';
  if (audioExtensions.indexOf(extension) !== -1) return 'audio';
  if (docExtensions.indexOf(extension) !== -1) return 'document';

  return 'unknown';
}

function getCurrentDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
  const day = now.getDate().toString().padStart(2, '0');

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


// formatMessage(text: string): SafeHtml {
//   if (!text) return '';

//   // Regex for Indian-style 10-digit mobile numbers (modify as per your country/needs)
//   const mobileRegex = /\b(?:91)?\d{10}\b/g;

//   // Replace numbers with <strong>number</strong>
//   const formatted = text
//     .replace(mobileRegex, (match, offset) =>
//       `<span id="mobile-${offset}" class="mobile-number" data-number="${match}">${match}</span>`)
//     .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
//     .replace(/_(.*?)_/g, '<em>$1</em>')
//     .replace(/~(.*?)~/g, '<s>$1</s>')
//     .replace(/\n/g, '<br>');

//   return this.sanitizer.bypassSecurityTrustHtml(formatted);
// }
