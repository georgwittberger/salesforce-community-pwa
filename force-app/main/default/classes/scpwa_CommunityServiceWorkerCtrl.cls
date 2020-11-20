public with sharing class scpwa_CommunityServiceWorkerCtrl {
  public String getContent() {
    StaticResource worker = [
      SELECT Body FROM StaticResource WHERE Name = 'scpwa_CommunityServiceWorker' LIMIT 1
    ];
    return worker.Body.toString();
  }
}
