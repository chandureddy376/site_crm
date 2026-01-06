import { Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { sharedservice } from '../../shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import { EchoService } from '../../echo.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

declare var $: any;
declare var swal: any;

@Component({
  selector: 'app-team-chat',
  templateUrl: './team-chat.component.html',
  styleUrls: ['./team-chat.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class TeamChatComponent implements OnInit {

  @ViewChild('messageContainer') messageContainer: ElementRef;
  imagesFiles: any[] = [];
  imagesuploads: string[] = [];
  profileFiles: any[] = [];
  profileuploads: string[] = [];
  isSidebarHovered: boolean = false;
  private hoverSubscription: Subscription;
  static count: number;
  allchatparam: any;
  groupchatparam: any;
  unreadchatparam: any;
  optionalchatparam: any;
  selectedIndex: number = -1;
  imageUrls: SafeUrl[] = [];
  isSearch: boolean = false;
  executive_name: string = '';
  send_message: string = '';
  chatid: any;
  chattype: any;
  executivesList: any;
  copyOfExecutivesList: any;
  filterLoader: boolean = true;
  searchfilterLoader: boolean = false;
  selectedPersonChat: any;
  roleid: any;
  userid: any;
  messageList: any;
  messages_search: string = '';
  private shouldAutoScroll = true;
  shouldShowArrow: boolean = false;
  private pdf: any = null;
  isCreationGroup: boolean = false;
  selectedGroupExecutives: any[] = [];
  selectedForwardExecutives: any[] = [];
  isGroupName: boolean = false;
  groupName: string = '';
  editgroupName: string = '';
  member_name: string = '';
  isGroupInfo: boolean = false;
  selectedGroupName: string = '';
  addMembersList: any;
  copyAddMembersList: any;
  selectedAddMembers: any;
  isEditGroupName: boolean = false;
  listOfGroupMembers: any;
  listOfMembersNames: any;
  isAdmin: boolean = false;
  isMessageBlocked: boolean = false;
  searchedMessageList: any[] = [];
  groupMemberIds: any;
  copyofExecutivesAddMemList: any;
  id: any;
  isSending: boolean = false;
  selectedMessageOption: string = '';
  selectedOptionText: any;
  textareaRows: number = 1;
  maxRows: number = 6;
  popoverNumber: string | null = null;
  popoverPosition: { top: number; left: number } | null = null;
  showToast = false;
  toastTimeout: any;
  floatingDate: string = '';
  searchedChatsResultsArray: any[] = [];
  searchedMessagesResultsArray: any[] = [];
  copySearchedChatsResultsArray: any[] = [];
  copySearchedMessagesResultsArray: any[] = [];
  isEditenable: boolean = true;
  isDelete: boolean = true;
  isForwardMode: boolean = false;
  selectedMessages: any[] = [];
  isFetchingMessages = false;
  messageId: any;
  messageDate: any;
  searchSubject: Subject<string> = new Subject();
  totalMessageCounts: number = 0;
  totalActualMessageCounts: number = 0;
  loadmoreChat: boolean = false;
  fromDate: any;
  toDate: any;
  firstMessageDate: any;
  isLoadmoreIcon: boolean = false;
  apiResponseDate: any;
  isMessageInfo: boolean = false;
  messageInfoDetails: any;
  searchMessageForChat: Subject<string> = new Subject();

  constructor(
    private readonly _sharedService: sharedservice,
    private readonly _echoService: EchoService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2) {
    this.roleid = localStorage.getItem('Role');
    this.userid = localStorage.getItem('UserId');
    this.getChatList();
    TeamChatComponent.count = 0;
  }

  ngOnInit() {
    this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.hoverSubscription = this._sharedService.hoverState$.subscribe((isHovered) => {
      this.isSidebarHovered = isHovered;
    });

    this.searchSubject
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(term => {
        this.performSearch(term);
      });

    this.searchMessageForChat.debounceTime(500).distinctUntilChanged().subscribe(term => {
      this.searchMessagesInp(term);
    })

    this._echoService.listenToDatabaseChanges((data) => {
      if ((data && data.length > 0 && this.userid == data['0']['Receiver']) || (data && data.length > 0 && this.userid == data['0']['Sender'])) {
        const messagesArray = data[1];
        if (Array.isArray(messagesArray) && messagesArray.length > 0) {
          let lastMessage;
          if (messagesArray.length > 1) {
            let chatdata;
            if (this.chattype == 'individual') {
              console.log(' inside if')
              chatdata = this.executivesList.filter((chat) => chat.executives_IDPK == this.chatid);
              this.selectedPersonChat = chatdata[0];
            } else if (this.chattype == 'group') {
              console.log(' else if')
              chatdata = this.executivesList.filter((chat) => chat.chat_id == this.chatid);
              this.selectedPersonChat = chatdata[0];
            }
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

          if (this.selectedMessageOption == 'edit') {
            this.messageList = messagesArray.map((m) => {
              return m.item_id == this.selectedOptionText.item_id ? m : m
            });
          }

          if (!alreadyExists) {
            if (lastMessage.chat_id == this.selectedPersonChat.chat_id) {
              // this.messageList = this.messageList.filter((mes) => { return mes.item_id != '' });
              this.messageList.push(lastMessage);
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
                this.updatedAsMessageRead(this.selectedPersonChat.chat_id)
              }, 0)
            } else if (messagesArray.length == 1) {
              this.getChatListForFreshChat().subscribe(exec => {
                this.executivesList = exec.details;
                this.copyOfExecutivesList = exec['details'];

                let executives = this.executivesList.filter((chat) => {
                  return chat.executives_IDPK == this.chatid;
                })

                this.selectedPersonChat = executives[0];

                if (lastMessage.chat_id == executives[0].chat_id) {
                  // this.messageList = this.messageList.filter((mes) => { return mes.item_id != '' });
                  this.messageList.push(lastMessage);
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

                  this.updatedAsMessageRead(this.selectedPersonChat.chat_id)
                }
              })
            }
            // Auto-scroll to the bottom
            setTimeout(() => {
              if (this.messageContainer && this.messageContainer.nativeElement) {
                const element = this.messageContainer.nativeElement;
                element.scrollTop = element.scrollHeight;
              }
            }, 100);
            if (messagesArray.length > 1 && ((lastMessage.chat_id != this.selectedPersonChat.chat_id) || this.selectedPersonChat == null)) {
              this.getListOfChat();
            }
          }

          this.selectedOptionText = '';
          this.selectedMessageOption = '';

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
    // localStorage.setItem('selectedChatId','')
    // localStorage.setItem('previousSelectedChatId','')
  }

  ngAfterViewInit() {
    this.scrollToBottom();
    if (this.messageContainer && this.messageContainer.nativeElement) {
      this.messageContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
    }
  }

  ngAfterViewChecked() {
    if (this.shouldAutoScroll) {
      this.scrollToBottom();
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

  //here in this method we will get to know whether its a manual scroll and enable the scrolling.
  // onScroll() {
  //   const element = this.messageContainer.nativeElement;
  //   const threshold = 0;
  //   const position = element.scrollTop + element.clientHeight;
  //   const height = element.scrollHeight;
  //   this.shouldAutoScroll = (height - position) < threshold;

  //   const difference = height - position;
  //   if (difference > 10) {
  //     this.shouldShowArrow = true;
  //   } else {
  //     this.shouldShowArrow = false;
  //   }
  // }

  // In this method we captured the queryparams and triggered the need methods.
  getData() {
    this.route.queryParams.subscribe((params) => {
      this.allchatparam = params['allchat'];
      this.groupchatparam = params['groupchat'];
      this.unreadchatparam = params['unreadchat'];
      this.optionalchatparam = params['optionchat'];
      this.chatid = params['chatid'];
      this.chattype = params['type'];
      this.messageId = params['messId'];
      this.messageDate = params['messDate'];
      TeamChatComponent.count = 0;

      if (this.executive_name && this.executive_name.length > 0) {
        // this.searchExecutive();
        this.performSearch(this.executive_name)
      } else {
        this.messageId = '';
        this.messageDate = '';
      }

      if (params['index']) {
        this.selectedIndex = params['index'];
      } else {
        this.selectedIndex = -1;
      }

      if (this.chatid) {
        let chatdata
        if (this.chattype == 'individual') {
          chatdata = this.executivesList.filter((chat) => chat.executives_IDPK == this.chatid);
          this.selectedPersonChat = chatdata[0];
        } else if (this.chattype == 'group') {
          chatdata = this.executivesList.filter((chat) => chat.chat_id == this.chatid);
          this.selectedPersonChat = chatdata[0];
        }

        if (this.selectedPersonChat.first_message_time) {
          let firstMessage = new Date(this.selectedPersonChat.first_message_time);
          this.firstMessageDate = firstMessage.toISOString().split('T')[0];
        }
        this.totalActualMessageCounts = this.selectedPersonChat.totalchats + this.selectedPersonChat.totalattach;
        if (this.totalActualMessageCounts > 0) {
          this.totalMessageCounts = this.totalActualMessageCounts - 20;
        } else {
          this.totalMessageCounts = 0;
        }
        this.getOneToOneChat();
        setTimeout(() => {
          this.scrollToBottom();
        }, 0)
      } else {
        this.selectedPersonChat = '';
        // localStorage.setItem('selectedChatId','')
        // localStorage.setItem('previousSelectedChatId','')
      }

      if (this.allchatparam == '1') {
        this.selectedChatType('all')
      } else if (this.groupchatparam == '1') {
        this.selectedChatType('group')
      } else if (this.unreadchatparam == '1') {
        this.selectedChatType('unread')
      } else if (this.optionalchatparam == '1') {
        this.selectedChatType('option')
      }
    })
  }

  //This method is written to get the chat list and using this till we get the response next move cant be done in eco service subscribe in Init
  getChatListForFreshChat(): Observable<any> {
    return this._sharedService.getAllChats(this.userid);
  }

  // here we get the list of chats and the API triggers one more time.
  getChatList() {
    this._sharedService.getAllChats(this.userid).subscribe((exec) => {
      this.filterLoader = false;
      this.executivesList = exec['details'];
      this.copyOfExecutivesList = exec['details'];
      this.getData();
    })
  }

  // here we get the list of chats only.
  getListOfChat() {
    let param = {
      limit: 0,
      limitrows: 30,
      loginid: this.userid
    }
    this._sharedService.getAllChats(this.userid).subscribe((exec) => {
      this.filterLoader = false;
      this.executivesList = exec['details'];
      this.copyOfExecutivesList = exec['details'];
      if (this.groupchatparam == '1') {
        this.executivesList = this.copyOfExecutivesList.filter((mem) => {
          return mem.chat_type == 'group';
        })
      } else if (this.unreadchatparam == '1') {
        this.executivesList = this.copyOfExecutivesList.filter((mem) => {
          return mem.unreadcount > 0;
        })
      }
    })
  }

  // here we get the chat histroy based on the selected chat id 
  getOneToOneChat() {
    let param;
    if (this.executive_name && this.executive_name.length > 0 && this.selectedPersonChat.chat_id != null) {
      const latestDate = new Date();
      this.toDate = latestDate.toISOString().split('T')[0];

      const fromDateObj = new Date(this.messageDate);
      this.fromDate = fromDateObj.toISOString().split('T')[0];
    } else if (this.selectedPersonChat.chat_id != null) {
      const latestDate = new Date(this.selectedPersonChat.latest_message_time);
      this.toDate = latestDate.toISOString().split('T')[0];

      const fromDateObj = new Date(latestDate);
      fromDateObj.setDate(fromDateObj.getDate() - 1);
      this.fromDate = fromDateObj.toISOString().split('T')[0];
    }

    if (this.selectedPersonChat.chat_id == null) {
      this.fromDate = '';
      this.toDate = '';
    }

    // let count = this.totalMessageCounts < 0 ? 0 : this.totalMessageCounts
    if (this.chattype == 'individual') {
      param = {
        // limit: count,
        // limitrows: 20,
        from: this.fromDate,
        to: this.toDate,
        loginid: this.userid,
        recId: this.selectedPersonChat.executives_IDPK
      }
    } else if (this.chattype == 'group') {
      param = {
        // limit: count,
        // limitrows: 20,
        from: this.fromDate,
        to: this.toDate,
        loginid: this.userid,
        type: 'gcht',
        groupid: this.selectedPersonChat.chat_id,
        encryptid: this.selectedPersonChat.encryptid
      }
      this.getGroupListMembers();
    }
    this.filterLoader = true;
    this._sharedService.get121Chats(param).subscribe((resp) => {
      this.filterLoader = false;
      this.isMessageBlocked = false;
      if (resp.status == 'True') {
        this.messageList = resp['details'];
        if (this.chattype == 'group') {
          this.messageList.forEach((list) => {
            if ((list.item_type == 'member_removed' || list.item_type == 'member_left') && list.sender_id == this.userid) {
              this.isMessageBlocked = true;
            }
          })
        }
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

        if (this.messageId != null && this.messageId != undefined && this.messageId != '') {
          let searchedMes = this.messageList.filter((resp) => {
            return resp.item_id == this.messageId;
          })
          setTimeout(() => {
            let targetId;
            targetId = 'chat-item-' + searchedMes[0].item_id;
            const element = document.getElementById(targetId);
            if (element) {
              // Scroll smoothly to the message
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // Add a highlight class temporarily
              element.classList.add('highlight');
              setTimeout(() => element.classList.remove('highlight'), 2000);
            }
          }, 100)

        } else {
          setTimeout(() => {
            if (this.messageContainer && this.messageContainer.nativeElement) {
              const element = this.messageContainer.nativeElement;
              element.scrollTop = element.scrollHeight;
            }
          }, 100);
        }
        this.loadmoreChat = false;
        if (resp.lastmsgdate && resp.lastmsgdate[0].last_message_date) {
          this.apiResponseDate = resp.lastmsgdate[0].last_message_date;
          if (this.messageList && this.messageList.length <= 8) {
            this.loadmoreChat = true;
          }
        }
        // this.totalMessageCounts = this.totalMessageCounts - 20;
      } else {
        this.messageList = [];
        this.loadmoreChat = false;
      }
    })
  }

  //here we will get selected chat type i.e all,group,unread etc,
  selectedChatType(type) {
    $('.add_class').removeClass('active');
    if (type == 'all') {
      $('.all_chat').addClass('active');
      if (this.executive_name && this.executive_name.length > 0) {
        this.searchedChatsResultsArray = this.copySearchedChatsResultsArray;
        this.searchedMessagesResultsArray = this.copySearchedMessagesResultsArray;
      } else {
        this.executivesList = this.copyOfExecutivesList;
      }
    } else if (type == 'group') {
      $('.groups_chat').addClass('active');
      if (this.executive_name && this.executive_name.length > 0) {
        this.searchedChatsResultsArray = this.copySearchedChatsResultsArray.filter((mem) => {
          return mem.chat_type == 'group';
        })

        this.searchedMessagesResultsArray = this.copySearchedMessagesResultsArray.filter((mem) => {
          return mem.chat_type == 'group';
        })
      } else {
        this.executivesList = this.copyOfExecutivesList.filter((mem) => {
          return mem.chat_type == 'group';
        })
      }
    } else if (type == 'unread') {
      $('.unread_chat').addClass('active');
      if (this.executive_name && this.executive_name.length > 0) {
        this.searchedChatsResultsArray = this.copySearchedChatsResultsArray.filter((mem) => {
          return mem.unreadcount > 0;
        })

        this.searchedMessagesResultsArray = this.copySearchedMessagesResultsArray.filter((mem) => {
          return mem.unreadcount > 0;
        })
      } else {
        this.executivesList = this.copyOfExecutivesList.filter((mem) => {
          return mem.unreadcount > 0;
        });
      }
    } else if (type == 'option') {
      $('.options_chat').addClass('active');
      this.executivesList = this.copyOfExecutivesList
    }
    // this.executive_name = '';
  }

  //here we get the data of the particular selected chat from the list.
  selectedchat(chat, index) {
    console.log(chat,index)
    this.updatedAsMessageRead(chat.chat_id);
    // this.searchedChatsResultsArray = [];
    // this.searchedMessagesResultsArray = [];
    this.fromDate = '';
    this.toDate = '';
    this.apiResponseDate = '';
    this.searchedMessageList = [];
    this.selectedMessageOption = '';
    this.selectedMessages = [];
    this.selectedPersonChat = chat;
    this.messages_search = '';
    if (this.selectedPersonChat.chat_id != chat.chat_id) {
      this.selectedIndex = index;
    }
    this.loadmoreChat = false;
    this.totalActualMessageCounts = this.selectedPersonChat.totalchats;
    if (this.selectedPersonChat.first_message_time) {
      let firstMessage = new Date(this.selectedPersonChat.first_message_time);
      this.firstMessageDate = firstMessage.toISOString().split('T')[0];
    }
    // this.totalMessageCounts = this.totalActualMessageCounts - 20;
    this._sharedService.setIndicationForChatSelection('chatselected');
    let id;
    this.send_message = '';
    if (chat.chat_type == 'individual') {
      id = chat.executives_IDPK;
    } else if (chat.chat_type == 'group') {
      id = chat.chat_id;
      this.isSearch = false;
      this.isGroupInfo = false;
      this.isMessageInfo = false;
      // this.getGroupListMembers();
    }
    let messId, messDate;
    if (this.executive_name != null && this.executive_name != undefined && this.executive_name != undefined && this.executive_name.length > 0) {
      messId = this.selectedPersonChat.message_id;
      messDate = this.selectedPersonChat.latest_message_time;
    }
    setTimeout(() => {
      this.getListOfChat();
    }, 0)
    this.router.navigate([], {
      queryParams: {
        chatid: id,
        index: index,
        type: chat.chat_type,
        messId: messId,
        messDate: messDate
      },
      queryParamsHandling: 'merge'
    })
  }

  // here this method is triggered while we enter the text and clik enter Button.
  // onKeyUp(event: KeyboardEvent): void {
  //   if (event.key === 'Enter') {
  //     if (this.imagesFiles.length > 0) {
  //       this.uploadImageWithMessage();
  //     } else {
  //       this.sendMessage();
  //     }
  //   }
  // }

  onKeyDown(event: KeyboardEvent): void {
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

  onKeyUp(event: KeyboardEvent): void {
    const textarea: HTMLTextAreaElement = document.getElementById('chatting_input_field') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Check for Ctrl + B (bold)
    if (event.ctrlKey && event.key === 'b') {
      event.preventDefault();
      this.applyFormatting('*');
    }

    // Check for Ctrl + I (italic)
    if (event.ctrlKey && event.key === 'i') {
      event.preventDefault();
      this.applyFormatting('_');
    }
  }

  applyFormatting(wrapper: string): void {
    const textarea: HTMLTextAreaElement = document.getElementById('chatting_input_field') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selectedText = this.send_message.substring(start, end);
    if (!selectedText) return;

    const formatted = `${wrapper}${selectedText}${wrapper}`;
    this.send_message =
      this.send_message.substring(0, start) + formatted + this.send_message.substring(end);

    // Reset selection
    setTimeout(() => {
      const newCursorPos = start + formatted.length;
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
    });
  }

  // here we get the searched name 
  // searchExecutive() {
  //   let groupList: any;
  //   let unreadChats: any;

  //   if (this.executive_name) {
  //     if (this.executive_name.length >= 2) {
  //       this.searchfilterLoader = true;
  //       this._sharedService.searchNameMessage(this.executive_name, this.userid).subscribe((resp) => {
  //         this.searchfilterLoader = false;
  //         if (resp.status == "True") {
  //           this.searchedChatsResultsArray = resp['details'].chats;
  //           this.searchedMessagesResultsArray = resp['details'].messages;
  //           this.copySearchedChatsResultsArray = resp['details'].chats;
  //           this.copySearchedMessagesResultsArray = resp['details'].messages;

  //           if (this.allchatparam == '1') {
  //             this.searchedChatsResultsArray = this.copySearchedChatsResultsArray;
  //             this.searchedMessagesResultsArray = this.copySearchedMessagesResultsArray;

  //           } else if (this.groupchatparam == '1') {
  //             this.searchedChatsResultsArray = this.copySearchedChatsResultsArray.filter((mem) => {
  //               return mem.chat_type == 'group';
  //             })

  //             this.searchedMessagesResultsArray = this.copySearchedMessagesResultsArray.filter((mem) => {
  //               return mem.chat_type == 'group';
  //             })
  //           } else if (this.unreadchatparam == '1') {
  //             this.searchedChatsResultsArray = this.copySearchedChatsResultsArray.filter((mem) => {
  //               return mem.unreadcount > 0;
  //             })

  //             this.searchedMessagesResultsArray = this.copySearchedMessagesResultsArray.filter((mem) => {
  //               return mem.unreadcount > 0;
  //             })
  //           }

  //         } else {
  //           this.searchedChatsResultsArray = [];
  //           this.searchedMessagesResultsArray = [];
  //           this.copySearchedChatsResultsArray = [];
  //           this.copySearchedMessagesResultsArray = [];
  //         }
  //       })
  //     }
  //   }

  //   // groupList = this.copyOfExecutivesList.filter((list) => {
  //   //   return list.chat_type == 'group';
  //   // });

  //   // unreadChats = this.copyOfExecutivesList.filter((list) => {
  //   //   return list.unreadcount > 0;
  //   // });
  //   // if (this.executive_name) {
  //   //   if (this.allchatparam == '1') {
  //   //     this.executivesList = this.copyOfExecutivesList.filter((exec) => {
  //   //       return exec.executives_name.toLowerCase().includes(this.executive_name.toLowerCase()) || (exec.latest_message_content && exec.latest_message_content.toLowerCase().includes(this.executive_name.toLowerCase()));
  //   //     });
  //   //   } else if (this.groupchatparam == '1') {
  //   //     this.executivesList = groupList.filter((grp) => {
  //   //       return grp.executives_name.toLowerCase().includes(this.executive_name.toLowerCase()) || (grp.latest_message_content && grp.latest_message_content.toLowerCase().includes(this.executive_name.toLowerCase()));
  //   //     })
  //   //   } else if (this.unreadchatparam == '1') {
  //   //     this.executivesList = unreadChats.filter((unread) => {
  //   //       return unread.executives_name.toLowerCase().includes(this.executive_name.toLowerCase()) || (unread.latest_message_content && unread.latest_message_content.toLowerCase().includes(this.executive_name.toLowerCase()));
  //   //     })
  //   //   }
  //   // } else {
  //   //   if (this.allchatparam == '1') {
  //   //     this.executivesList = this.copyOfExecutivesList;
  //   //   } else if (this.groupchatparam == '1') {
  //   //     this.executivesList = groupList;
  //   //   } else if (this.unreadchatparam == '1') {
  //   //     this.executivesList = unreadChats
  //   //   }
  //   // }
  // }

  // here we get the searched name while group creation
  searchGroupCreationExecutive() {
    if (this.executive_name) {
      const searchText = this.executive_name.toLowerCase();
      this.executivesList = this.copyofExecutivesAddMemList.slice().sort((a, b) => {
        const aMatch = a.executives_name.toLowerCase().includes(searchText);
        const bMatch = b.executives_name.toLowerCase().includes(searchText);

        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
      // this.executivesList = this.copyofExecutivesAddMemList.filter((mem)=>{
      //   return  mem.executives_name.toLowerCase().includes(searchText);
      // })
    } else {
      this.executivesList = this.copyofExecutivesAddMemList.slice();
    }
  }

  //This method is used for filter in search iin forward messsage popup.
  searchForwardMessageExecutive() {
    if (this.executive_name) {
      const searchText = this.executive_name.toLowerCase();

      this.executivesList = this.copyOfExecutivesList.slice().sort((a, b) => {
        const aMatch = a.executives_name.toLowerCase().includes(searchText);
        const bMatch = b.executives_name.toLowerCase().includes(searchText);

        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    } else {
      this.executivesList = this.copyOfExecutivesList.slice();
      this.executive_name = '';
    }
  }

  //here we get the searched name for add more members
  filteraddMemExecutive() {
    var checkBoxes = $("#start4 span :checkbox:lt(" + event.target + ")");
    setTimeout(() => {
      $(checkBoxes).prop("checked", !checkBoxes.prop("checked"));
      $('mes[id="creategroupcheckboxid"]').attr("disabled", false);
      $('.creategrouphidecheckbox').show();
    }, 0)
    if (this.member_name) {
      const searchText = this.executive_name.toLowerCase();

      this.addMembersList = this.copyAddMembersList.slice().sort((a, b) => {
        const aMatch = a.executives_name.toLowerCase().includes(searchText);
        const bMatch = b.executives_name.toLowerCase().includes(searchText);

        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    } else {
      this.addMembersList = this.copyAddMembersList.slice();
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
    if (this.chattype == 'individual') {
      param = {
        loginid: this.userid,
        recieverid: this.chatid,
        message: this.send_message.trim(),
        messageid: messid,
        edit: editid
      }
    } else if (this.chattype == 'group') {
      param = {
        loginid: this.userid,
        type: 'gmsg',
        groupid: this.selectedPersonChat.chat_id,
        messageid: messid,
        message: this.send_message.trim(),
        edit: editid
      }
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
      // this.filterLoader = true;
      // let message = {
      //   chat_id: this.chatid,
      //   content: this.send_message.trim(),
      //   created_at: getCurrentDateTime(),
      //   group_id: this.selectedPersonChat.chat_id,
      //   item_type: "message",
      //   message_type: "text",
      //   sender_id: this.userid,
      //   sender_name: localStorage.getItem('Name'),
      //   updated_at: getCurrentDateTime(),
      //   item_id: '',
      //   edited: 0
      // };
      // this.messageList.push(message);
      // this.send_message = '';
      // this.textareaRows = 1;
      // this.scrollToBottom();
      this._sharedService.sendMessage(param).subscribe((resp) => {
        this.filterLoader = false;
        if (resp.status == 'True') {
          this.send_message = '';
          this.textareaRows = 1;
          this.isSending = false;
          if (this.selectedMessageOption != 'edit') {
            this.selectedOptionText = '';
            this.selectedMessageOption = '';
          }
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
        const formData = new FormData();
        formData.append('senderid', this.userid);
        formData.append('recieverid', this.chatid);
        formData.append('message', this.send_message.trim());
        formData.append('attachment', this.imagesFiles[k]);
        formData.append('messageid', messid);
        formData.append('edit', editid);
        if (this.chattype == 'group') {
          formData.append('chattype', 'gpatch');
          formData.append('groupid', this.selectedPersonChat.chat_id)
        }
        requests.push(this._sharedService.sendAttachment(formData));
      }
    } else {
      const formData = new FormData();
      formData.append('senderid', this.userid);
      formData.append('recieverid', this.chatid);
      formData.append('message', this.send_message.trim());
      formData.append('attachment', '');
      formData.append('messageid', messid);
      formData.append('edit', editid);
      if (this.chattype == 'group') {
        formData.append('chattype', 'gpatch');
        formData.append('groupid', this.selectedPersonChat.chat_id)
      }
      requests.push(this._sharedService.sendAttachment(formData));
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
    // Manually trigger the file mes click to open the file dialog
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
            };
            reader.readAsDataURL(file);
            $('#imagesFile' + i).siblings(".file-label-" + i).addClass("selected").html(file.name);
          }
        }
      }
    }
  }

  //here its check the type of the video and photo.
  isValidImageOrVideo(file: File): boolean {
    const imageExtensions = ['image/png', 'image/jpeg'];
    const videoExtensions = ['video/mp4', 'video/avi', 'video/mkv', 'video/webm', 'video/mov'];
    return imageExtensions.includes(file.type) || videoExtensions.includes(file.type);
  }

  //this is to validate the video type.
  isVideo(fileName: string): boolean {
    const videoExtensions = ['.mp4', '.avi', '.mkv', '.webm', '.mov'];
    if (fileName) {
      return videoExtensions.some(extension => fileName.endsWith(extension));
    }
  }

  //Here on clicking search the input field will be focused.
  searchMessage() {
    this.isSearch = true;
    this.isGroupInfo = false;
    this.isMessageInfo = false
    setTimeout(() => {
      $('.search_messages').focus();
    }, 100)
  }

  //In this methode we close the search column.
  closeMessageSearch() {
    this.isSearch = false;
    this.isGroupInfo = false;
    this.isMessageInfo = false;
    this.messages_search ='';
  }

  //here we search for a particular message or files in histroy chat.
  searchMessagesInp(term) {
    // if (this.messages_search) {
    //   let messageList = this.messageList.filter((mes) => {
    //     return mes.item_type == 'message';
    //   });
    //   this.searchedMessageList = messageList.filter((data) => {
    //     return data.content.toLowerCase().includes(this.messages_search.toLowerCase());
    //   })
    // } else {
    //   this.searchedMessageList = [];
    // }
    if (term) {
      this._sharedService.searchNameMessage(term, this.userid, this.selectedPersonChat.chat_id).subscribe((resp) => {
        this.searchfilterLoader = false;
        if (resp.status == "True") {
          this.searchedMessageList = resp['details'].messages;
        } else {
          this.searchedMessageList = [];
        }
      });
    }
  }

  //here we close the chat in right side opened section.
  closechat() {
    this.selectedPersonChat = '';
    this.apiResponseDate = '';
    this.messages_search ='';
    this.router.navigate([], {
      queryParams: {
        chatid: '',
        index: '',
        type: '',
        messId: '',
        messDate: ''
      }, queryParamsHandling: 'merge'
    })

  }

  //here we remove the file if not need ed before the upload.
  // removeFiles(file, i) {
  //   this.imagesFiles.splice(i, 1);
  //   this.imagesuploads.splice(i, 1);
  //   if (this.imagesFiles.length == 0) {
  //     this.imagesFiles = [];
  //     this.imagesuploads = [];
  //     this.imageUrls = [];
  //     $("#imagesFile" + i).val('');
  //     $('.file-label-' + i).html('Choose file ');
  //   }
  // }

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

  //In this method we clear the history.
  getSelectedGroupMem() {
    this.executivesList = this.copyOfExecutivesList.filter((chat) => {
      return chat.chat_type == 'individual' && chat.active_status == '0';
    });
    this.copyofExecutivesAddMemList = this.executivesList;

    $('#start3 span:checkbox').each(function () {
      this.checked = false;
    });
    if (this.isGroupInfo == false) {
      this.isCreationGroup = true;
    }
    var checkBoxes = $("#start3 span :checkbox:lt(" + event.target + ")");
    setTimeout(() => {
      $(checkBoxes).prop("checked", !checkBoxes.prop("checked"));
      $('input[id="creategroupcheckboxid"]').attr("disabled", false);
      $('.creategrouphidecheckbox').show();
    }, 100)
  }

  //using this method we select or de-select the group members.
  isSelected(exec: any): boolean {
    if (this.selectedGroupExecutives) {
      return this.selectedGroupExecutives.some(e => e.executives_IDPK == exec.executives_IDPK);
    }
  }

  //In this method we get the selected group members.
  getselectedMembers() {
    var selectedObjects = $("input[name='programming']:checked").map(function () {
      return JSON.parse($(this).attr('data-assign'));
    }).get();
    this.selectedGroupExecutives = selectedObjects;
    // selectedObjects.forEach((exec)=>{
    //   this.selectedGroupExecutives.push(exec);
    // })
  }

  //In this method , used to add more members.
  getselectedAddMembers() {
    var selectedObjects = $("input[name='programmingAdd']:checked").map(function () {
      return JSON.parse($(this).attr('data-assign'));
    }).get();
    this.selectedGroupExecutives = selectedObjects;
  }

  //Here we selected executives for forward messsage.
  getselectedForwardMessagesMembers() {
    var selectedObjects = $("input[name='programmingForword']:checked").map(function () {
      return JSON.parse($(this).attr('data-assign'));
    }).get();
    this.selectedForwardExecutives = selectedObjects;
  }

  //In this method we de-select the  selected executives for group members
  executiveclose(i, exec) {
    if (this.selectedGroupExecutives) {
      this.selectedGroupExecutives = this.selectedGroupExecutives.filter((execid) => {
        return execid.executives_IDPK != exec.executives_IDPK;
      })
    }
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
      return this.selectedForwardExecutives.some((e) => {
        if (e.chat_id) {
          return e.chat_id == exec.chat_id
        }
      });
    }
  }

  //using this method we close the group creation modal.
  closeGroupModal() {
    this.isCreationGroup = false;
    this.selectedGroupExecutives = [];
    this.executive_name = '';
    if (this.groupchatparam == 1) {
      this.executivesList = this.copyOfExecutivesList.filter((chat) => {
        return chat.chat_type == 'group';
      })
    } else if (this.unreadchatparam == 1) {
      this.executivesList = this.copyOfExecutivesList.filter((chat) => {
        return chat.unreadcount > 0;
      })
    } else {
      this.executivesList = this.copyOfExecutivesList;
    }
  }

  //using this we close the group name modal .
  closeGroupNameModal() {
    this.isCreationGroup = true;
    this.groupName = '';
    this.isGroupName = false;
  }

  closeGroupInfoAddModal() { }

  //In this method create name page will appear.
  createGroupName() {
    this.isGroupName = true;
    this.isCreationGroup = false;
  }

  //In this method we create the group.
  createGroup() {
    let executivesIds = this.selectedGroupExecutives.map((exec) => exec.executives_IDPK);
    this.groupName.trim();
    if (this.groupName.trim() == '' || this.groupName == undefined || this.groupName == null) {
      this.groupName = '';
      $('#name').focus().css('border', '1px solid red').attr('placeholder', 'Please enter a valid Group Name');
      return false;
    } else {
      $('#name').removeAttr("style");
    }

    let param = {
      members: executivesIds.join(','),
      loginid: this.userid,
      groupname: this.groupName.trim(),
      type: 'gct'

    }
    this.filterLoader = true;
    this._sharedService.sendMessage(param).subscribe((resp) => {
      this.filterLoader = false;
      if (resp.status == 'True') {
        $('.modal-backdrop').closest('div').remove();
        let currentUrl = this.router.url;
        let pathWithoutQueryParams = currentUrl.split('?')[0];
        let currentQueryparams = this.route.snapshot.queryParams;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
        });
      }
    })
  }

  //on clicking the add new photo file manager wbr opened
  addProfilePhoto() {
    setTimeout(() => {
      const fileInput = document.getElementById('customFile0') as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }, 0)
  }

  //In this method we store the uploaded image 
  uploadProfilePic(i, event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    this.filterLoader = true;
    if (files.length == 0) {
      this.filterLoader = false;
    }

    if (files && files.length > 0) {
      const file = files[0]; // Only one file, so we take the first one

      if (file.type != 'image/png' && file.type !== 'image/jpeg') {
        this.filterLoader = false;
        swal({
          title: 'Invalid File Type',
          text: 'Only PNG/JPEG files are allowed.',
          type: "error",
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          input.value = '';
          this.profileFiles = [];
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
            this.profileFiles = [];
            this.profileuploads = [];
          });
        } else {
          // Push the file to closurefiles and read the file
          this.profileFiles = [file];  // Only keep the new file
          this.profileuploads = [];
          const replacefile = this.profileFiles[0];
          // Remove '+' from the name
          const newFileName = replacefile.name.replace(/[+]/g, '');
          const updatedFile = new File([replacefile], newFileName, { type: replacefile.type });
          this.profileFiles[0] = updatedFile;
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.profileuploads.push(event.target.result);
            this.filterLoader = false;
          };
          reader.readAsDataURL(file);
          $('#customFile' + i).siblings(".file-label-" + i).addClass("selected").html(file.name);
        }
      }
    }
  }

  //In this method we filter the list of members who is not in group.
  groupChatInfo() {
    if (this.chattype == 'group') {
      this.isSearch = true;
      this.isGroupInfo = true;
      this.isMessageInfo = false;
      this.selectedGroupName = this.selectedPersonChat.executives_name;
      let removedWithoutGroupList = this.copyOfExecutivesList.filter((team) => {
        return team.chat_type != 'group';
      });

      this.addMembersList = removedWithoutGroupList.filter((mem) => {
        return !this.listOfGroupMembers.some((grpmem) => {
          return mem.executives_IDPK == grpmem.memberid;
        })
      })

      this.copyAddMembersList = this.addMembersList;
    }
  }

  //In this list we get the list of group members and checking whether the logged person is Admin or not.
  getGroupListMembers() {
    let param = {
      loginid: this.userid,
      groupid: this.selectedPersonChat.chat_id,
      type: 'gmbrlst'
    }
    this.filterLoader = true;
    this._sharedService.getAllGroupMembers(param).subscribe((resp) => {
      this.filterLoader = false;
      if (resp.status == 'True') {
        this.listOfGroupMembers = resp['details'];
        let membersName = this.listOfGroupMembers.map((mem) => mem.membername);
        this.listOfMembersNames = membersName.join(',');

        this.listOfGroupMembers.forEach((mem) => {
          if (mem.memberid == this.userid && mem.grouprole == '1') {
            this.isAdmin = true;
          }
        })

        this.groupMemberIds = this.listOfGroupMembers.filter((mem) => {
          return mem.memberid == this.userid
        })
      }
    })
  }

  //In this method we updated the group name the existing group
  editGroupName() {
    this.isEditGroupName = true;
    this.editgroupName = this.selectedGroupName;
    setTimeout(() => {
      $('.group_name').focus();
    }, 100)
  }

  updatedGroupName() {
    let param = {
      loginid: this.userid,
      groupname: this.editgroupName,
      groupid: this.selectedPersonChat.chat_id,
      edit_gn: 1,
      type: 'gct'
    }
    this.filterLoader = true;
    this._sharedService.sendMessage(param).subscribe((resp) => {
      this.filterLoader = false;
      if (resp.status == 'True') {
        $('.modal-backdrop').closest('div').remove();
        let currentUrl = this.router.url;
        let pathWithoutQueryParams = currentUrl.split('?')[0];
        let currentQueryparams = this.route.snapshot.queryParams;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
        });
      }
    })
  }

  //In this method we add more members to the exisiting group with group name change.
  addMoreMembers() {
    let executivesIds = this.selectedGroupExecutives.map((exec) => exec.executives_IDPK);
    let param = {
      members: executivesIds.join(','),
      loginid: this.userid,
      groupname: this.selectedPersonChat.executives_name,
      type: 'gct'

    }
    this.filterLoader = true;
    this._sharedService.sendMessage(param).subscribe((resp) => {
      this.filterLoader = false;
      if (resp.status == 'True') {
        $('.modal-backdrop').closest('div').remove();
        let currentUrl = this.router.url;
        let pathWithoutQueryParams = currentUrl.split('?')[0];
        let currentQueryparams = this.route.snapshot.queryParams;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
        });
      }
    })
  }

  //In this code  we remove or leave the group and if admin of the group tries to exit showing and swal message.
  removeMemFromGroup(actiontype, member) {
    let memid;
    if (actiontype == 'remove') {
      memid = member.memberid;
    } else if (actiontype == 'leave') {
      memid = this.userid;
    }

    let memberdata = this.listOfGroupMembers.filter((mem) => {
      return mem.memberid == this.userid;
    });

    if (memberdata && memberdata[0].grouprole == '1' && actiontype == 'leave') {
      swal({
        title: 'You are the Admin',
        text: `You Can't Exit from the Group`,
        type: "error",
        timer: 2000,
        showConfirmButton: false
      });
      return false;
    } else {
      let param = {
        loginid: this.userid,
        groupid: this.selectedPersonChat.chat_id,
        memberid: memid,
        actiontype: actiontype
      }
      this.filterLoader = true;
      this._sharedService.removeMemberFromGroup(param).subscribe((resp) => {
        this.filterLoader = false;
        if (resp.status == 'True') {
          if (actiontype == 'leave') {
            this.router.navigateByUrl('/team-chat?allchat=1');
          }
          $('.modal-backdrop').closest('div').remove();
          let currentUrl = this.router.url;
          let pathWithoutQueryParams = currentUrl.split('?')[0];
          let currentQueryparams = this.route.snapshot.queryParams;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([pathWithoutQueryParams], { queryParams: currentQueryparams });
          });
        }
      })
    }
  }

  //In this method if the user searches for the particular message and clicks on it  we re-directed to that message in the message conatiner.
  searchedMessageClicked(searchedMes: any, type) {
    const latestDate = new Date();
    let toDate = latestDate.toISOString().split('T')[0];

    const fromDateObj = new Date(searchedMes.reply_id_date);
    let fromDate = fromDateObj.toISOString().split('T')[0];
    // this.fromDate = fromDate;
    // this.toDate = toDate
    let param;
    if (this.chattype == 'individual') {
      param = {
        from: fromDate,
        to: toDate,
        loginid: this.userid,
        recId: this.selectedPersonChat.executives_IDPK
      }
    } else if (this.chattype == 'group') {
      param = {
        from: fromDate,
        to: toDate,
        loginid: this.userid,
        type: 'gcht',
        groupid: this.selectedPersonChat.chat_id,
        encryptid: this.selectedPersonChat.encryptid
      }
      this.getGroupListMembers();
    }
    this.messageList = [];
    this.filterLoader = true;
    this._sharedService.get121Chats(param).subscribe((resp) => {
      this.filterLoader = false;
      this.isMessageBlocked = false;
      if (resp.status == 'True') {
        this.messageList = resp['details'];
        if (this.chattype == 'group') {
          this.messageList.forEach((list) => {
            if ((list.item_type == 'member_removed' || list.item_type == 'member_left') && list.sender_id == this.userid) {
              this.isMessageBlocked = true;
            }
          })
        }
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

        if (resp.lastmsgdate && resp.lastmsgdate[0].last_message_date) {
          this.apiResponseDate = resp.lastmsgdate[0].last_message_date;
        }
        setTimeout(() => {
          let targetId;
          if (type == 'search') {
            targetId = 'chat-item-' + searchedMes.item_id;
          } else if (type == 'rep') {
            targetId = 'chat-item-' + searchedMes.reply_id;
          } else {
            targetId = 'chat-item-' + searchedMes.item_id;
          }
          const element = document.getElementById(targetId);
          if (element) {
            // Scroll smoothly to the message
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a highlight class temporarily
            element.classList.add('highlight');
            setTimeout(() => element.classList.remove('highlight'), 2000);
          }
        }, 500)

        this.loadmoreChat = false;
      }
    })
  }

  //in this method we make the unread count to read for the selected chat
  updatedAsMessageRead(id) {
    let param = {
      loginid: this.userid,
      chatid: id
    }
    this._sharedService.convertMessageToRead(param).subscribe((resp) => {
      this.getListOfChat();
    })
  }

  //In this method we clear the history.
  getSelectedForwardMem() {
    $('#start5 span:checkbox').each(function () {
      this.checked = false;
    });
    if (this.isGroupInfo == false) {
      this.isCreationGroup = true;
    }
    var checkBoxes = $("#start3 span :checkbox:lt(" + event.target + ")");
    setTimeout(() => {
      $(checkBoxes).prop("checked", !checkBoxes.prop("checked"));
      $('input[id="forwardcheckboxid"]').attr("disabled", false);
      $('.forwardhidecheckbox').show();
    }, 100)
  }

  //on clicking on the more options get the message
  externalOptionMes(message) {
    if (!message.created_at) return false;

    const createdAt = new Date(message.created_at);
    const now = new Date();
    const diffInMs = now.getTime() - createdAt.getTime();
    const diffInMinutes = diffInMs / (1000 * 60);


    if (diffInMinutes >= 5) {
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

  onMessageDoubleClick(message: any) {
    this.messageOptions('reply', message)
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
      this.isForwardMode = true;
      // this.getSelectedForwardMem();
      // $('#forward_message_btn').click();
      // this.isCreationGroup = false;
      this.selectedMessages.push(message);
    } else if (type == 'reply') {
      setTimeout(() => {
        $('#chatting_input_field').focus();
      }, 100)
    } else if (type == 'replywithmessage') {
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
    } else if (type == 'info') {
      this.isSearch = true;
      this.isMessageInfo = true;
      this.isGroupInfo = false;
      let param = {
        senderid: message.sender_id,
        messageid: message.item_id
      }
      this.filterLoader = true;
      this._sharedService.getMessageInfo(param).subscribe({
        next: (resp) => {
          this.filterLoader = false;
          this.messageInfoDetails = resp.details
        }, error: (err) => {
          this.filterLoader = false;
          console.log('error', err)
        }
      })
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

  //in this message we forward message to the selected members
  forwardMessage() {
    let param;
    let messid = '';
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

    let groupids, individualids;
    let individualArray = this.selectedForwardExecutives.filter((m) => {
      return m.chat_type == 'individual'
    })
    let individualMapIds = individualArray.map(m => m.executives_IDPK);
    individualids = individualMapIds.join(',');

    let groupArray = this.selectedForwardExecutives.filter((m) => {
      return m.chat_type == 'group'
    })
    let groupMapIds = groupArray.map(m => m.chat_id);
    groupids = groupMapIds.join(',');

    if (individualids) {
      param = {
        loginid: this.userid,
        recieverid: individualids,
        // message: this.selectedOptionText.content,
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
    if (groupids) {
      param = {
        loginid: this.userid,
        type: 'gmsg',
        groupid: groupids,
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
    // if (this.imagesFiles.length > 0) {
    //   this.uploadImageWithMessage();
    // } else {
    //   if (this.isSending) return;
    //   this.isSending = true;
    //   this._sharedService.sendMessage(param).subscribe((resp) => {
    //     this.filterLoader = false;
    //     if (resp.status == 'True') {
    //       this.send_message = '';
    //       this.textareaRows = 1;
    //       this.isSending = false;
    //       this.selectedOptionText = '';
    //       this.selectedMessageOption = '';
    //       $('.modal-backdrop').closest('div').remove();
    //       $('#forwardClose').click();
    //       this.selectedForwardExecutives = [];
    //       if (this.messageContainer && this.messageContainer.nativeElement) {
    //         const element = this.messageContainer.nativeElement;
    //         element.scrollTop = element.scrollHeight;
    //       }
    //       setTimeout(() => {
    //         $('#chatting_input_field').focus();
    //       }, 1000)
    //     } else if (resp.status == 'False') {
    //       this.isSending = false;
    //     }
    //   })
    // }
  }

  moveToForwardModal() {
    this.getSelectedForwardMem();
    $('#forward_message_btn').click();
    this.isCreationGroup = false;
  }

  onMessageSelect(event: any, message: any) {
    if (event.target.checked) {
      this.selectedMessages.push(message);
    } else {
      this.selectedMessages = this.selectedMessages.filter(m => m.item_id !== message.item_id);
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
    setTimeout(() => {
      this.adjustRows();
    }, 0)
  }

  // removeBrochureImage(i) {
  //     this.profileuploads = [];
  //     this.profileFiles = [];
  //     if (this.profileuploads.length == 0) {
  //       $("#customFile" + i).val('');
  //       $('.file-label-' + i).html('Choose file ');
  //     } else {

  //     }
  //     // alert(this.uploads.length);
  // }

  // onCopy(event: ClipboardEvent, content: string) {
  //   // event.preventDefault();

  //   if (event.clipboardData) {
  //     event.clipboardData.setData('text/plain', content); // Copy real tabs
  //   }
  // }

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

  formatMessage(text: string): SafeHtml {
    if (!text) return '';

    // Regex for Indian-style 10-digit mobile numbers (modify as per your country/needs)
    const mobileRegex = /\b(?:91)?\d{10}\b/g;

    // Replace numbers with <strong>number</strong>
    const formatted = text
      .replace(mobileRegex, (match, offset) =>
        `<span id="mobile-${offset}" class="mobile-number" data-number="${match}">${match}</span>`)
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/~(.*?)~/g, '<s>$1</s>')
      .replace(/\n/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(formatted);
  }

  adjustRows(): void {
    const lines = this.send_message.split('\n').length;

    // Estimate rows based on line count or content length
    const estimatedRows = Math.min(this.maxRows, lines + Math.floor(this.send_message.length / 50));

    this.textareaRows = Math.max(1, estimatedRows);
    if (this.textareaRows > 3) {
      this.scrollToBottom();
    }
  }

  showCopiedToast() {
    this.showToast = true;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
    }, 1000);
  }

  // numberClicked(phoneNumber: string, event: MouseEvent) {
  //   event.stopPropagation();
  //   if (this.popoverNumber == phoneNumber) {
  //     this.popoverNumber = null;
  //     this.popoverPosition = null;
  //   } else {
  //     this.popoverNumber = phoneNumber;
  //     // Calculate position of the popover
  //     this.popoverPosition = { top: event.clientY, left: event.clientX };
  //   }
  // }

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

  // copyNumber() {
  //   if (!this.popoverNumber) return;
  //   if ((navigator as any).clipboard) {
  //     (navigator as any).clipboard.writeText(this.popoverNumber).then(() => {
  //       this.showCopiedToast();
  //       this.popoverNumber = null;
  //     })
  //   }
  // }

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

  fetchOlderMessages() {
    let param;
    const element = this.messageContainer.nativeElement;
    this.isLoadmoreIcon = true;
    // let count = this.totalMessageCounts < 0 ? 0 : this.totalMessageCounts;
    if (this.executive_name && this.executive_name.length > 0 && (this.apiResponseDate == '' || this.apiResponseDate == undefined || this.apiResponseDate == null)) {
      const latestDate = new Date(this.fromDate);
      latestDate.setDate(latestDate.getDate() - 1);
      this.toDate = latestDate.toISOString().split('T')[0];

      const fromDateObj = new Date(this.fromDate);
      fromDateObj.setDate(fromDateObj.getDate() - 2);
      this.fromDate = fromDateObj.toISOString().split('T')[0];
    } else if (this.apiResponseDate) {
      const latestDate = new Date(this.apiResponseDate);
      this.toDate = latestDate.toISOString().split('T')[0];

      const fromDateObj = new Date(this.apiResponseDate);
      fromDateObj.setDate(fromDateObj.getDate() - 1);
      this.fromDate = fromDateObj.toISOString().split('T')[0];
    } else {
      const latestDate = new Date(this.fromDate);
      latestDate.setDate(latestDate.getDate() - 1);
      this.toDate = latestDate.toISOString().split('T')[0];

      const fromDateObj = new Date(this.fromDate);
      fromDateObj.setDate(fromDateObj.getDate() - 2);
      this.fromDate = fromDateObj.toISOString().split('T')[0];
    }

    if (element.scrollTop == 0) {
      if (this.chattype == 'individual') {
        param = {
          // limit: count,
          // limitrows: 20,
          from: this.fromDate,
          to: this.toDate,
          loginid: this.userid,
          recId: this.selectedPersonChat.executives_IDPK
        }
      } else if (this.chattype == 'group') {
        param = {
          // limit: count,
          // limitrows: 20,
          from: this.fromDate,
          to: this.toDate,
          loginid: this.userid,
          type: 'gcht',
          groupid: this.selectedPersonChat.chat_id,
          encryptid: this.selectedPersonChat.encryptid
        }
        this.getGroupListMembers();
      }
      if ((this.firstMessageDate == this.toDate || this.firstMessageDate == this.fromDate) || this.messageList.length <= this.totalActualMessageCounts) {
        this.loadmoreChat = false;
      }
      if (this.messageList.length <= this.totalActualMessageCounts || (this.firstMessageDate == this.toDate || this.firstMessageDate == this.fromDate)) {
        // this.filterLoader = true;
        this._sharedService.get121Chats(param).subscribe((exec) => {
          if (exec.status == 'True') {
            this.isLoadmoreIcon = false;
            // this.filterLoader = false;
            if (!exec.details || exec.details.length == 0) {
              return;
            }
            if (this.chattype === 'group') {
              exec.details.forEach((list) => {
                if ((list.item_type === 'member_removed' || list.item_type === 'member_left') &&
                  list.sender_id === this.userid) {
                  this.isMessageBlocked = true;
                }
              });
            }

            const newMessages = exec.details.map(m => {
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

            const container = this.messageContainer.nativeElement;
            const prevHeight = container.scrollHeight;

            this.messageList = newMessages.concat(this.messageList);
            // this.totalMessageCounts = this.totalMessageCounts - 20;

            setTimeout(() => {
              const newHeight = container.scrollHeight;
              container.scrollTop = newHeight - prevHeight;
            }, 0);
            if (exec.lastmsgdate && exec.lastmsgdate[0].last_message_date) {
              this.apiResponseDate = exec.lastmsgdate[0].last_message_date;
            }
            this.loadmoreChat = false;

            setTimeout(() => {
              if (this.messageList && this.messageList.length <= 10) {
                this.loadmoreChat = true;
              }
            }, 10)

          } else {
            this.isLoadmoreIcon = false;
            this.filterLoader = false;
            setTimeout(() => {
              this.onScroll();
            }, 100)
          }
        })
      }
    }
  }

  onScroll() {
    const element = this.messageContainer.nativeElement;

    // Auto-scroll detection (your existing logic)
    const threshold = 0;
    const position = element.scrollTop + element.clientHeight;
    const height = element.scrollHeight;
    this.shouldAutoScroll = (height - position) < threshold;

    const difference = height - position;
    this.shouldShowArrow = difference > 10;

    if (!element || this.isFetchingMessages) return;
    // if (element.scrollTop <= 40) {
    //   // this.fetchOlderMessages();
    //   this.loadmoreChat = true;
    // }

    if (Math.floor(element.scrollTop) <= 10) {
      this.loadmoreChat = true;
    }

    if ((this.firstMessageDate == this.toDate || this.firstMessageDate == this.fromDate) || (this.messageList.length == this.totalActualMessageCounts)) {
      this.loadmoreChat = false;
    }
    // Floating date tracking
    const dateElements = element.querySelectorAll('span.left_mem[id^="date-"]');

    let currentTopDate = '';

    for (let i = 0; i < dateElements.length; i++) {
      const el = dateElements[i] as HTMLElement;
      const rect = el.getBoundingClientRect();
      const containerRect = element.getBoundingClientRect();

      if (rect.top <= containerRect.top + 50) {
        const id = el.getAttribute('id');
        if (id) {
          currentTopDate = id.replace('date-', '');
        }
      } else {
        break;
      }
    }

    if (currentTopDate && currentTopDate !== this.floatingDate) {
      this.floatingDate = currentTopDate;
    }
  }

  clearSearchedResult() {
    this.executive_name = '';
    this.searchedChatsResultsArray = [];
    this.searchedMessagesResultsArray = [];
    this.copySearchedChatsResultsArray = [];
    this.copySearchedMessagesResultsArray = [];
    if (this.allchatparam == '1') {
      $('.all_chat').addClass('active');
      this.executivesList = this.copyOfExecutivesList;
    } else if (this.groupchatparam == '1') {
      $('.groups_chat').addClass('active');
      this.executivesList = this.copyOfExecutivesList.filter((mem) => {
        return mem.chat_type == 'group';
      })
    } else if (this.unreadchatparam == 'unread') {
      $('.unread_chat').addClass('active');
      this.executivesList = this.copyOfExecutivesList.filter((mem) => {
        return mem.unreadcount > 0;
      });
    }
  }

  getFormattedTime(message: any): string {
    return this.formatMessageTime(message);
  }

  formatMessageTime(datetimeStr: string): string {
    if (!datetimeStr) return '';

    const mesDate = new Date(datetimeStr);
    const presentNow = new Date();

    const mesDay = mesDate.getDate();
    const mesMonth = mesDate.getMonth();
    const mesYear = mesDate.getFullYear();

    const presentDay = presentNow.getDate();
    const presentMonth = presentNow.getMonth();
    const presentYear = presentNow.getFullYear();

    // Check if it's today
    if (mesDay === presentDay && mesMonth === presentMonth && mesYear === presentYear) {
      return mesDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }

    // Check if it's yesterday
    const yesterday = new Date();
    yesterday.setDate(presentNow.getDate() - 1);

    if (mesDay === yesterday.getDate() && mesMonth === yesterday.getMonth() && mesYear === yesterday.getFullYear()) {
      return 'Yesterday';
    }

    // Else return formatted date "dd/mm/yyyy"
    const day = ('0' + mesDay).slice(-2);
    const month = ('0' + (mesMonth + 1)).slice(-2);
    return `${day}/${month}/${mesYear}`;
  }

  //   this.setOverflowHidden(); oninit code to block n unblock overflow

  // // Store initial height
  // this.originalHeight = window.innerHeight;

  // // Listen for resize events
  // this.resizeListener = this.renderer.listen('window', 'resize', () => {
  //   this.onResize();
  // });  oninit code to block n unblock overflow

  //  private onResize() {
  //   const currentHeight = window.innerHeight;

  //   // If height is significantly smaller (DevTools likely opened)
  //   if (currentHeight < this.originalHeight - 100) {
  //     this.setOverflowScroll();
  //   }
  //   // If height is back to near original, restore hidden
  //   else if (currentHeight >= this.originalHeight - 20) {
  //     this.setOverflowHidden();
  //   }
  // }

  // private setOverflowHidden() {
  //   this.renderer.setStyle(document.documentElement, 'overflow', 'hidden');
  //   this.renderer.setStyle(document.body, 'overflow', 'hidden');
  // }

  // private setOverflowScroll() {
  //   this.renderer.setStyle(document.documentElement, 'overflow', 'auto');
  //   this.renderer.setStyle(document.body, 'overflow', 'auto');
  // }

  performSearch(term: string) {
    if (!term || term.length < 2) {
      this.searchedChatsResultsArray = [];
      this.searchedMessagesResultsArray = [];
      return;
    }

    this.searchfilterLoader = true;
    this._sharedService.searchNameMessage(term, this.userid, '').subscribe((resp) => {
      this.searchfilterLoader = false;
      if (resp.status == "True") {
        this.searchedChatsResultsArray = resp['details'].chats;
        this.searchedMessagesResultsArray = resp['details'].messages;
        this.copySearchedChatsResultsArray = resp['details'].chats;
        this.copySearchedMessagesResultsArray = resp['details'].messages;

        if (this.allchatparam == '1') {
          this.searchedChatsResultsArray = this.copySearchedChatsResultsArray;
          this.searchedMessagesResultsArray = this.copySearchedMessagesResultsArray;

        } else if (this.groupchatparam == '1') {
          this.searchedChatsResultsArray = this.copySearchedChatsResultsArray.filter((mem) => {
            return mem.chat_type == 'group';
          })

          this.searchedMessagesResultsArray = this.copySearchedMessagesResultsArray.filter((mem) => {
            return mem.chat_type == 'group';
          })
        } else if (this.unreadchatparam == '1') {
          this.searchedChatsResultsArray = this.copySearchedChatsResultsArray.filter((mem) => {
            return mem.unreadcount > 0;
          })

          this.searchedMessagesResultsArray = this.copySearchedMessagesResultsArray.filter((mem) => {
            return mem.unreadcount > 0;
          })
        }

      } else {
        this.searchedChatsResultsArray = [];
        this.searchedMessagesResultsArray = [];
        this.copySearchedChatsResultsArray = [];
        this.copySearchedMessagesResultsArray = [];
      }
    });
  }

  disappear24(type) {
    let param = {
      encryptid: type,
      groupid: this.selectedPersonChat.chat_id
    }
    this._sharedService.disappear24Message(param).subscribe({
      next: (resp) => {
        this.getChatList();
        setTimeout(() => {
          this.getOneToOneChat();
        }, 0)
      }, error: (err) => {
        console.log('error', err);
      }
    })
  }

}

function normalizeText(str: string) {
  return str
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, '\t')
    .replace(/\s+/g, ' ')
    .trim();
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
