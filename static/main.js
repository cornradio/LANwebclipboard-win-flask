// 默认设置和初始化
document.documentElement.setAttribute('data-theme', 'dark');
document.getElementById('input-text').focus();

// 主题切换
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// 加载保存的主题
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// 清空历史记录
function clearHistory() {
    if (confirm('确定要清空所有内容吗?')) {
        fetch('/clear', { method: 'POST' })
        document.querySelector('.card').innerHTML = '';
    }
}



// 粘贴剪贴板内容
function pasteClipboard() {
    navigator.clipboard.readText()
        .then(text => {
            document.getElementById('input-text').value = text;
            document.getElementById('text-form').submit();
        })
        .catch(err => {
            console.error('读取剪贴板失败:', err);
        });
}

// Ctrl Enter键提交
document.getElementById('input-text').addEventListener('keydown', function(e) {
    console.log(e.key)
    if ((e.key === 'Enter' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault(); // 阻止默认的换行行为
        //press button #add-btn
        document.querySelector('#add-btn').click();
    } 
    //F1 js
    if (e.key === 'F1') {
        e.preventDefault(); // 阻止默认的换行行为
        //<textarea id="input-text" 增加 script tag
        const textarea = document.querySelector('textarea[name="text"]');
        textarea.value = `<script>

</script>
<style>

</style>`;
        
    }
    //F2 sytyle
    if (e.key === 'F2') {
        e.preventDefault(); // 阻止默认的换行行为
        //<textarea id="input-text" 增加 sytle tag
        const textarea = document.querySelector('textarea[name="text"]');
        textarea.value = `<iframe>

</iframe>`;
    }
});


// 监听粘贴事件
document.addEventListener('paste', async function(e) {
    const items = e.clipboardData.items;
    let files = [];
    let text = '';

    for (let item of items) {
        if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            const randomStr = Math.random().toString(36).substring(2, 8);
            const newFile = new File([file], `image_${randomStr}.png`, {
                type: file.type,
                lastModified: file.lastModified
            });
            files.push(newFile);
        } else if (item.kind === 'file') {
            const file = item.getAsFile();
            files.push(file);
        } else if (item.type === 'text/plain') {
            item.getAsString((str) => {
                text += str;
            });
        }
    }

    if (files.length > 0) {
        const file = files[0]; 
        if (file.type.startsWith('image/')) {
            uploadImage(files);
        } else {
            uploadFiles(files); 
        }
    }
    
    if (text) {
        const textarea = document.querySelector('textarea[name="text"]');
        textarea.value += (textarea.value ? '\n' : '') + text;
    }
});

// 图片上传相关函数
document.getElementById('file-input').addEventListener('change', async function(e) {
    if (e.target.files && e.target.files.length > 0) {
        await uploadImage(Array.from(e.target.files));
    }
});

async function uploadImage(files) {
    const fileArray = Array.isArray(files) ? files : [files];
    
    try {
        // 一次处理一个文件
        for (const file of fileArray) {
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            
            const imageUrl = await response.text();
            if (imageUrl) {
                const fileSize = formatFileSize(file.size);
                const content = `<div class="image-card">
                    <img src="${imageUrl}" alt="${file.name}" >
                    <div class="image-info">
                        <i class="fas fa-image" style="margin-right: 4px;"></i>
                        <span>${file.name} (${fileSize})</span>
                    </div>
                </div>`;
                
                // 为每个文件单独提交
                const textarea = document.querySelector('textarea[name="text"]');
                textarea.value = content;
                document.querySelector('#add-btn').click();
            }
        }
    } catch (error) {
        console.error('上传出错:', error);
    }
}

// 文件上传相关函数
async function uploadFiles(files) {
    // 将 FileList 转换为数组
    const fileArray = Array.from(files);
    console.log('转换后的文件数组:', fileArray); // 调试用
    
    for(const file of fileArray) {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/upload_file', {
                method: 'POST',
                body: formData
            });
            
            const fileUrl = await response.text();
            if (fileUrl) {
                const fileIcon = getFileIcon(file.name);
                const fileSize = formatFileSize(file.size);
                let fileLink = `<div class="file-card">
                
                <i class="${fileIcon}" style="margin-right: 8px;"></i>
                <a href="${fileUrl}" target="_blank">${file.name}</a>
                <span class="file-info" style="margin-left: 8px;">(${fileSize})</span>
                </div>
                <video controls >
                <source src="${fileUrl}" type="${file.type}">
                </video>`;

                if (file.type.startsWith('image/')) {
                    fileLink = `<div class="file-card">
                
                <i class="${fileIcon}" style="margin-right: 8px;"></i>
                <a href="${fileUrl}" target="_blank">${file.name}</a>
                <span class="file-info" style="margin-left: 8px;">(${fileSize})</span>
                </div>
                <img  src="${fileUrl}" type="${file.type}">
                </img>`;
                }
                if (file.type.startsWith('video/')) {
                    fileLink = `<div class="file-card">
                
                <i class="${fileIcon}" style="margin-right: 8px;"></i>
                <a href="${fileUrl}" target="_blank">${file.name}</a>
                <span class="file-info" style="margin-left: 8px;">(${fileSize})</span>
                </div>
                <video controls >
                <source src="${fileUrl}" type="${file.type}">
                </video>`;
                }
                
                // 使用 API 提交而不是点击按钮
                await fetch('/api/add_card', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: fileLink })
                });
                
                // 直接在前端添加新卡片
                const cardContainer = document.querySelector('.card');
                const newCard = document.createElement('div');
                newCard.className = 'card-wrapper';
                newCard.innerHTML = `
                    <div class="card-header">
                        <button onclick="downloadCard(this)" class="icon-button raw-button download-button" style="padding: 4px 8px; font-size: 12px;" title="下载">
                            <i class="fas fa-download"></i>
                        </button>
                        <button onclick="deleteCard(this)" class="icon-button raw-button delete-button" style="padding: 4px 8px; font-size: 12px;" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <pre class="card-content" style="text-align: left; align-self: flex-start;">
${fileLink}
                    </pre>
                `;
                cardContainer.insertBefore(newCard, cardContainer.firstChild);
            }
        } catch (error) {
            console.error('文件上传失败:', error);
        }
    }
}

// 工具函数
function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const iconMap = {
        'jpg': 'fas fa-file-image',
        'jpeg': 'fas fa-file-image',
        'png': 'fas fa-file-image',
        'gif': 'fas fa-file-image',
        'webp': 'fas fa-file-image',
        'pdf': 'fas fa-file-pdf',
        'doc': 'fas fa-file-word',
        'docx': 'fas fa-file-word',
        'xls': 'fas fa-file-excel',
        'xlsx': 'fas fa-file-excel',
        'ppt': 'fas fa-file-powerpoint',
        'pptx': 'fas fa-file-powerpoint',
        'zip': 'fas fa-file-archive',
        'rar': 'fas fa-file-archive',
        '7z': 'fas fa-file-archive',
        'js': 'fas fa-file-code',
        'css': 'fas fa-file-code',
        'html': 'fas fa-file-code',
        'py': 'fas fa-file-code',
        'txt': 'fas fa-file-alt',
        'md': 'fas fa-file-alt',
        'mp3': 'fas fa-file-audio',
        'wav': 'fas fa-file-audio',
        'mp4': 'fas fa-file-video',
        'avi': 'fas fa-file-video',
        'mov': 'fas fa-file-video'
    };
    
    return iconMap[ext] || 'fas fa-file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 拖放相关
const dropZone = document.getElementById('drop-zone');

document.addEventListener('dragenter', function(e) {
    e.preventDefault();
    dropZone.style.display = 'block';
});

document.addEventListener('dragover', function(e) {
    e.preventDefault();
});
//drop
dropZone.addEventListener('drop', async function(e) {
    e.preventDefault();
    dropZone.style.display = 'none';
    const files = Array.from(e.dataTransfer.files);

    if (files.length > 0) {
        const file = files[0]; 
        if (file.type.startsWith('image/')) {
            uploadImage(files);
        } else {
            uploadFiles(files); 
        }
    }
});

dropZone.addEventListener('dragleave', function(e) {
    if (e.target === dropZone) {
        dropZone.style.display = 'none';
    }
});

// 卡片操作相关函数
function showRawContent(button) {
    const content = button.closest('.card-wrapper').querySelector('.card-content').innerHTML;
    
    const rawWindow = window.open('', '_blank');
    rawWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Raw Content</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    background-color: #1e1e1e;
                    color: #d4d4d4;
                    font-family: 'Consolas', 'Courier New', monospace;
                    padding: 20px;
                    margin: 0;
                }
                pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    margin: 0;
                }
            </style>
        </head>
        <body>
            <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </body>
        </html>
    `);
    rawWindow.document.close();
}

async function deleteCard(button) {
    if (!confirm('确定要删除这条记录吗？')) {
        return;
    }
    
    const cardWrapper = button.closest('.card-wrapper');
    const content = cardWrapper.querySelector('.card-content').innerHTML.trim();
    
    try {
        const response = await fetch('/delete_card', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: content
            })
        });
        
        const result = await response.json();
        if (result.status === 'success') {
            cardWrapper.remove();
        } else {
            alert('删除失败：' + result.message);
        }
    } catch (error) {
        console.error('删除出错:', error);
        alert('删除失败，请重试');
    }
}

// 初始化卡片检查
document.addEventListener('DOMContentLoaded', function() {
    const cardWrappers = document.querySelectorAll('.card-wrapper');
    cardWrappers.forEach(wrapper => {
        const content = wrapper.querySelector('.card-content').innerHTML;
        const hasImageOrFile = content.includes('<img') || content.includes('file-card');
        const rawButton = wrapper.querySelector('.raw-button[title="查看原始内容"]');
        if (hasImageOrFile && rawButton) {
            rawButton.style.display = 'none';
        }
    });
});


async function downloadCard(button) {
    const cardContent = button.closest('.card-wrapper').querySelector('.card-content');
    const img = cardContent.querySelector('img');
    const fileLink = cardContent.querySelector('.file-card a');
    
    try {
        if (img) {
            // 处理图片下载
            const response = await fetch(img.src);
            const blob = await response.blob();
            
            const imageInfo = cardContent.querySelector('.image-info span');
            let fileName = 'image.png';
            if (imageInfo) {
                fileName = imageInfo.textContent.split(' (')[0];
            }
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
        } else if (fileLink) {
            // 处理文件下载 - 使用 fetch 获取文件内容
            const response = await fetch(fileLink.href);
            const blob = await response.blob();
            
            // 从文件卡片中获取原始文件名
            const fileName = fileLink.textContent;
            
            // 创建下载链接
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName; // 使用原始文件名
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
        } else {
            // 处理文本内容下载
            const content = cardContent.innerText.trim();
            const blob = new Blob([content], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'content.txt';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }
        
        // 显示下载成功反馈
        button.title = '下载成功！';
        button.style.backgroundColor = '#4CAF50';
        setTimeout(() => {
            button.title = '下载';
            button.style.backgroundColor = '';
        }, 1000);
        
    } catch (error) {
        console.error('下载失败:', error);
        button.title = '下载失败';
        button.style.backgroundColor = '#f44336';
        setTimeout(() => {
            button.title = '下载';
            button.style.backgroundColor = '';
        }, 1000);
    }
}

// 处理输入
function processInput(input) {
    var outstr = input.trim();
    // 使用正则表达式匹配所有链接
    outstr = outstr.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    return outstr;
}

async function addCard() {
    const textarea = document.querySelector('#input-text');
    let content = textarea.value;
    content = processInput(content);
    
    if (!content) return;
    
    try {
        const response = await fetch('/api/add_card', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: content })
        });
        
        const result = await response.json();
        
        if (result.status === 'success') {
            // 创建新卡片
            const cardContainer = document.querySelector('.card');
            const newCard = document.createElement('div');
            newCard.className = 'card-wrapper';
            newCard.innerHTML = `
                <div class="card-header">
                    <button onclick="showRawContent(this)" class="icon-button raw-button" title="查看原始内容" style="padding: 4px 8px; font-size: 12px;">
                        <i class="fas fa-code"></i>
                    </button>
                    <button onclick="downloadCard(this)" class="icon-button raw-button download-button" style="padding: 4px 8px; font-size: 12px;" title="下载">
                        <i class="fas fa-download"></i>
                    </button>
                    <button onclick="deleteCard(this)" class="icon-button raw-button delete-button" style="padding: 4px 8px; font-size: 12px;" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <pre class="card-content" >
${content}
                </pre>
            `;
            
            // 将新卡片插入到最前面
            cardContainer.insertBefore(newCard, cardContainer.firstChild);
            
            // 清空输入框
            textarea.value = '';
        } else {
            console.error('添加失败:', result.message);
        }
    } catch (error) {
        console.error('添加出错:', error);
    }
}