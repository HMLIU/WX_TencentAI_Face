Page({
  data: {
    age: "请上传照片",
    glasses: "请上传照片",
    beauty: "请上传照片",
    mask: "请上传照片",
    hat: "请上传照片",
    gender: "请上传照片",
    hair_length: "请上传照片",
    hair_bang: "请上传照片",
    hair_color: "请上传照片",
    image_src:"../../libs/img/user.svg"
  },
  UploadImage() {
    var myThis = this
    var random = Date.parse(new Date()) + Math.ceil(Math.random() * 1000)
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(chooseImage_res) {
        wx.showLoading({
          title: '加载中...',
        });
        myThis.setData({
          image_src: chooseImage_res.tempFilePaths[0]
        });
        const uploadTask = wx.cloud.uploadFile({
          cloudPath: random + '.png',
          filePath: chooseImage_res.tempFilePaths[0],
          success(uploadFile_res) {
            wx.cloud.callFunction({
              name: 'UpdateFile',
              data: {
                fileID: uploadFile_res.fileID
              },
              success(cloud_callFunction_res) {
                wx.hideLoading()
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 500
                })
                myThis.setData({
                  age: cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Age,
                  glasses: cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Glass,
                  beauty: cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Beauty,
                  mask: cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Mask,
                  hat: cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Hat,
                })
                if (cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Gender < 50) {
                  myThis.setData({
                    gender: "女"
                  });
                } else {
                  myThis.setData({
                    gender: "男"
                  });
                }
                switch (cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Hair.Length) {
                  case 0:
                    myThis.setData({
                      hair_length: "光头"
                    });
                    break;
                  case 1:
                    myThis.setData({
                      hair_length: "短发"
                    });
                    break;
                  case 2:
                    myThis.setData({
                      hair_length: "中发"
                    });
                    break;
                  case 3:
                    myThis.setData({
                      hair_length: "长发"
                    });
                    break;
                  case 4:
                    myThis.setData({
                      hair_length: "绑发"
                    });
                    break;
                }
                switch (cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Hair.Bang) {
                  case 0:
                    myThis.setData({
                      hair_bang: "有刘海"
                    });
                    break;
                  case 1:
                    myThis.setData({
                      hair_bang: "无刘海"
                    });
                    break;
                }
                switch (cloud_callFunction_res.result.FaceInfos[0].FaceAttributesInfo.Hair.Color) {
                  case 0:
                    myThis.setData({
                      hair_color: "黑色"
                    });
                    break;
                  case 1:
                    myThis.setData({
                      hair_color: "金色"
                    });
                    break;
                  case 0:
                    myThis.setData({
                      hair_color: "棕色"
                    });
                    break;
                  case 1:
                    myThis.setData({
                      hair_color: "灰白色"
                    });
                    break;
                }
              },
            })
          },
          fail(err) {
            wx.showToast({
              title: '失败，请重试！',
              duration: 500
            })
          },
        })
        uploadTask.onProgressUpdate((uploadFile_res) => {
          myThis.setData({
            progress: uploadFile_res.progress //上传进度
          })
        })
      }
    })
  },
  onLoad() {
    wx.cloud.init({
      env: 'test-f97abe'
    })
  }
})