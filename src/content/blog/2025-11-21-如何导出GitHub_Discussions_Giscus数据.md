---
slug: export-gitHub-discussions-giscus-data
title: 如何导出 GitHub Discussions / Giscus 数据
pubDate: 2025-11-21
categories: 
  - 技术
tags: 
  - GitHub Discussions
  - Giscus
---

如果你的静态博客使用了 Giscus 作为评论系统，那么所有评论内容实际上都会存储在你对应仓库的 GitHub Discussions 中。

这种方式免去了自建数据库和后端的麻烦，但很多人会关心一个问题：能否把评论备份导出？

答案是：可以！因为 GitHub 提供了完整的 API 来读取 Discussions 的全部数据。下面是一份 python 脚本，可以一键导出 Discussions 的数据成 json 格式。

**准备工作：**

脚本放在最下方，我们先需要得到几个关键数据：

- [ ] token（GITHUB_TOKEN）只需 `read:discussion` 权限
- [ ] 用户名（REPO_OWNER） 
- [ ] 仓库名（REPO_NAME）
- [ ] Giscus 分类 ID（CATEGORY_ID）

前三者很好得到，暂不提，分类 ID 可以在之前部署 Giscus 看到，也就是 `data-category-id` 的值。

![](https://imgurl.zishu.me/2025/11/1763689961720.webp)

**开始爬取**

在本地新建一个 `export_giscus.py` 文件，复制下面的代码进去，然后将这几个信息都填到配置中，最后在终端执行 `python export_giscus.py`。

程序会生成一个 `.json`文件，里面就是所有的 Giscus 评论数据。

```py
import requests
import json

# 配置
GITHUB_TOKEN = "YOUR_GITHUB_TOKEN"  # 填你的 token
REPO_OWNER = "your_owner"           # 仓库 owner
REPO_NAME = "your_repo"             # 仓库名
CATEGORY_ID = "your_category_id"    # 绑定 giscus 的 Discussion 分类 ID

# GraphQL Endpoint
API_URL = "https://api.github.com/graphql"
HEADERS = {"Authorization": f"Bearer {GITHUB_TOKEN}"}

def run_query(query, variables=None):
    r = requests.post(API_URL, headers=HEADERS, json={'query': query, 'variables': variables})
    if r.status_code != 200:
        raise Exception(f"Query failed with status code {r.status_code}: {r.text}")
    return r.json()

def export_discussions():
    discussions_data = []
    has_next_page = True
    end_cursor = None

    query = """
    query($owner:String!, $name:String!, $categoryId:ID!, $after:String) {
      repository(owner: $owner, name: $name) {
        discussions(first: 50, categoryId: $categoryId, after: $after) {
          nodes {
            id
            title
            url
            createdAt
            author { login, url }
            body
            comments(first: 100) {
              nodes {
                id
                createdAt
                author { login, url }
                body
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
    """

    while has_next_page:
        variables = {
            "owner": REPO_OWNER,
            "name": REPO_NAME,
            "categoryId": CATEGORY_ID,
            "after": end_cursor
        }
        result = run_query(query, variables)
        repo_data = result["data"]["repository"]["discussions"]
        for discussion in repo_data["nodes"]:
            discussions_data.append(discussion)
        end_cursor = repo_data["pageInfo"]["endCursor"]
        has_next_page = repo_data["pageInfo"]["hasNextPage"]

    with open(f"{REPO_OWNER}-{REPO_NAME}-giscus.json", "w", encoding="utf-8") as f:
        json.dump(discussions_data, f, ensure_ascii=False, indent=2)

    print(f"导出完成，共 {len(discussions_data)} 个 Discussion，保存到 {REPO_OWNER}-{REPO_NAME}-giscus.json")

if __name__ == "__main__":
    export_discussions()
```
