declare var filestack: any;
export class FilestackClient {
  static instance: any;
  static pick(): Promise<string> {
    return FilestackClient.instance
      .pick({
        fromSources: ['local_file_system', 'webcam'],
        transformations: {
          crop: {
            aspectRatio: 1,
          },
        },
      })
      .then((result: { filesUploaded: { url: any }[] }) => {
        return result.filesUploaded[0].url;
      });
  }
  static initialize() {
    FilestackClient.instance = filestack.init('APolcSi1mRB6sMqckiRdiz');
  }
}
